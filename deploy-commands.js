const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannir un membre')
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Le membre à bannir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Raison du bannissement')
                .setRequired(false)),

    new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulser un membre')
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Le membre à expulser')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Raison de l’expulsion')
                .setRequired(false)),

    new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Débannir un membre')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('ID du membre à débannir')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mettre un membre en timeout')
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Le membre à mute')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('Durée en minutes')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Retirer le timeout')
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Le membre à unmute')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprimer des messages')
        .addIntegerOption(option =>
            option.setName('nombre')
                .setDescription('Nombre de messages à supprimer')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)),

    new SlashCommandBuilder()
        .setName('role')
        .setDescription('Gérer les rôles')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ajouter')
                .setDescription('Ajouter un rôle à un membre')
                .addUserOption(option =>
                    option.setName('membre')
                        .setDescription('Le membre')
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Le rôle à ajouter')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('retirer')
                .setDescription('Retirer un rôle à un membre')
                .addUserOption(option =>
                    option.setName('membre')
                        .setDescription('Le membre')
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Le rôle à retirer')
                        .setRequired(true)))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
(async () => {
    try {
        console.log('🔄 Enregistrement des commandes...');

        await rest.put(
            Routes.applicationGuildCommands(
                '1554506632539672708',
                '1322967862863859723'
            ),
            { body: commands }
        );

        console.log('✅ Commandes enregistrées avec succès !');
    } catch (error) {
        console.error(error);
    }
})();