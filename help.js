const { EmbedBuilder } = require('discord.js');
const { getCommands, getGuild } = require('./database');

module.exports = {
  name: 'help',
  description: 'Shows all available commands',
  async execute(message, args, prefix) {
    const guild = getGuild(message.guild.id);
    const p = (guild && guild.prefix) || prefix;
    const customCommands = getCommands(message.guild.id);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('📋 Command List')
      .setDescription(`Prefix: \`${p}\``)
      .addFields(
        {
          name: '🛠 Moderation',
          value: [
            `\`${p}kick <user> [reason]\` - Kick a member`,
            `\`${p}ban <user> [reason]\` - Ban a member`,
            `\`${p}mute <user> <duration> [reason]\` - Mute a member`,
            `\`${p}unmute <user>\` - Unmute a member`,
            `\`${p}warn <user> [reason]\` - Warn a member`,
            `\`${p}warns <user>\` - View warns for a user`,
            `\`${p}clearwarns <user>\` - Clear all warns for a user`,
            `\`${p}clear <amount>\` - Clear messages`,
            `\`${p}modlogs [user]\` - View moderation logs`,
          ].join('\n'),
          inline: false,
        },
        {
          name: '⚙️ Utility',
          value: [
            `\`${p}ping\` - Check bot latency`,
            `\`${p}userinfo [user]\` - User information`,
            `\`${p}serverinfo\` - Server information`,
            `\`${p}avatar [user]\` - Get avatar`,
            `\`${p}rolelist\` - List server roles`,
          ].join('\n'),
          inline: false,
        },
        {
          name: '🎨 Role Management',
          value: [
            `\`${p}role give @user @role\` - Give a role`,
            `\`${p}role remove @user @role\` - Remove a role`,
            `\`${p}role create <name> [color]\` - Create a role`,
            `\`${p}role delete @role\` - Delete a role`,
            `\`${p}role rename @role <name>\` - Rename a role`,
            `\`${p}role color @role <color>\` - Change role color`,
            `\`${p}role list\` - List all roles`,
          ].join('\n'),
          inline: false,
        },
        {
          name: '🎫 Tickets',
          value: [
            `\`${p}ticket [reason]\` - Create a support ticket`,
            `\`${p}close\` - Close your ticket`,
            `\`${p}ticketsetup\` - Post a ticket panel with buttons (admin)`,
          ].join('\n'),
          inline: false,
        },
        {
          name: '📈 Leveling',
          value: [
            `\`${p}rank [user]\` - Check XP/level`,
            `\`${p}leaderboard\` - Server leaderboard`,
          ].join('\n'),
          inline: false,
        },
        {
          name: '🎨 Custom Commands',
          value: customCommands.length > 0
            ? customCommands.map((c) => `\`${p}${c.name}\``).join(', ')
            : 'No custom commands set up yet.',
          inline: false,
        }
      )
      .setFooter({ text: 'Manage everything from the dashboard!' })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
