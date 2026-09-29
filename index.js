const {
    Client,
    GatewayIntentBits,
    PermissionsBitField
} = require('discord.js');

require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} est connecté !`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'role') {
        const membre = interaction.options.getMember('membre');
        const role = interaction.options.getRole('role');
        const action = interaction.options.getSubcommand();

        if (!membre || !role) {
            return interaction.reply({
                content: '❌ Membre ou rôle introuvable.',
                ephemeral: true
            });
        }

        if (action === 'ajouter') {
            await membre.roles.add(role);
            return interaction.reply(
                `✅ Le rôle **${role.name}** a été ajouté à **${membre.user.tag}**.`
            );
        }

        if (action === 'retirer') {
            await membre.roles.remove(role);
            return interaction.reply(
                `✅ Le rôle **${role.name}** a été retiré de **${membre.user.tag}**.`
            );
        }
    }

    const command = interaction.commandName;

    // Vérification des permissions de modération
    const moderationCommands = [
        'ban',
        'unban',
        'kick',
        'mute',
        'unmute',
        'clear'
    ];

    if (
        moderationCommands.includes(command) &&
        !interaction.memberPermissions.has(
            PermissionsBitField.Flags.ModerateMembers
        ) &&
        !interaction.memberPermissions.has(
            PermissionsBitField.Flags.Administrator
        )
    ) {
        return interaction.reply({
            content: '❌ Tu n’as pas la permission d’utiliser cette commande.',
            ephemeral: true
        });
    }

    // BAN
    if (command === 'ban') {
        const member = interaction.options.getMember('membre');
        const reason =
            interaction.options.getString('raison') || 'Aucune raison';

        if (!member) {
            return interaction.reply({
                content: '❌ Membre introuvable.',
                ephemeral: true
            });
        }

        if (!member.bannable) {
            return interaction.reply({
                content: '❌ Je ne peux pas bannir ce membre.',
                ephemeral: true
            });
        }

        await member.ban({ reason });

        return interaction.reply(
            `🔨 **${member.user.tag}** a été banni.\n**Raison :** ${reason}`
        );
    }

    // KICK
    if (command === 'kick') {
        const member = interaction.options.getMember('membre');
        const reason =
            interaction.options.getString('raison') || 'Aucune raison';

        if (!member) {
            return interaction.reply({
                content: '❌ Membre introuvable.',
                ephemeral: true
            });
        }

        if (!member.kickable) {
            return interaction.reply({
                content: '❌ Je ne peux pas expulser ce membre.',
                ephemeral: true
            });
        }

        await member.kick(reason);

        return interaction.reply(
            `👢 **${member.user.tag}** a été expulsé.\n**Raison :** ${reason}`
        );
    }

    // UNBAN
    if (command === 'unban') {
        const userId = interaction.options.getString('id');

        try {
            await interaction.guild.members.unban(userId);

            return interaction.reply(
                `✅ L'utilisateur **${userId}** a été débanni.`
            );
        } catch {
            return interaction.reply({
                content: '❌ Impossible de débannir cet utilisateur.',
                ephemeral: true
            });
        }
    }

    // MUTE / TIMEOUT
    if (command === 'mute') {
        const member = interaction.options.getMember('membre');
        const minutes = interaction.options.getInteger('minutes');

        if (!member) {
            return interaction.reply({
                content: '❌ Membre introuvable.',
                ephemeral: true
            });
        }

        if (!member.moderatable) {
            return interaction.reply({
                content: '❌ Je ne peux pas mute ce membre.',
                ephemeral: true
            });
        }

        if (minutes < 1 || minutes > 40320) {
            return interaction.reply({
                content: '❌ La durée doit être comprise entre 1 et 40320 minutes.',
                ephemeral: true
            });
        }

        await member.timeout(
            minutes * 60 * 1000,
            `Mute par ${interaction.user.tag}`
        );

        return interaction.reply(
            `🔇 **${member.user.tag}** a été mute pendant **${minutes} minute(s)**.`
        );
    }

    // UNMUTE
    if (command === 'unmute') {
        const member = interaction.options.getMember('membre');

        if (!member) {
            return interaction.reply({
                content: '❌ Membre introuvable.',
                ephemeral: true
            });
        }

        await member.timeout(null);

        return interaction.reply(
            `🔊 **${member.user.tag}** n'est plus mute.`
        );
    }

    // CLEAR
    if (command === 'clear') {
        const amount = interaction.options.getInteger('nombre');

        const deleted = await interaction.channel.bulkDelete(
            amount,
            true
        );

        return interaction.reply({
            content: `🧹 **${deleted.size}** message(s) supprimé(s).`,
            ephemeral: true
        });
    }
});

client.login(process.env.TOKEN);