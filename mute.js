const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { addCase, getCasesByType, clearCases } = require('./database');

module.exports = {
  name: 'mute',
  description: 'Timeout a member',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply('❌ You need `Moderate Members` permission.');
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Please mention a user to mute.');

    const member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply('❌ User not found.');
    if (!member.moderatable) return message.reply('❌ I cannot mute that user.');

    const durationStr = args[1];
    if (!durationStr) return message.reply('❌ Please specify a duration (e.g. 10m, 1h, 1d).');

    const match = durationStr.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return message.reply('❌ Invalid duration format. Use e.g. 10m, 1h, 1d.');

    const value = parseInt(match[1]);
    const unit = match[2];
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    const ms = value * multipliers[unit];

    const reason = args.slice(2).join(' ') || 'No reason provided';

    await member.timeout(ms, reason);
    const caseId = addCase(message.guild.id, user.id, message.author.id, 'mute', reason, durationStr);

    const muteCount = getCasesByType(message.guild.id, user.id, 'mute').length;

    const embed = new EmbedBuilder()
      .setColor(0x808080)
      .setTitle('🔇 Member Muted')
      .addFields(
        { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
        { name: 'Moderator', value: message.author.tag, inline: true },
        { name: 'Duration', value: durationStr, inline: true },
        { name: 'Reason', value: reason },
        { name: 'Case', value: `#${caseId}`, inline: true },
        { name: 'Total Mutes', value: `${muteCount}`, inline: true }
      )
      .setTimestamp();

    if (muteCount >= 3) {
      if (member.kickable) {
        await member.kick('Auto-punishment: Reached 3 mutes');
        clearCases(message.guild.id, user.id, 'mute');
        embed.addFields({ name: '👢 Auto-Escalation', value: `User reached **3 mutes** and has been **kicked**. Mute cases cleared.` });
      } else {
        embed.addFields({ name: '👢 Auto-Escalation', value: `User reached **3 mutes** but could not be kicked (hierarchy issue).` });
      }
    }

    message.channel.send({ embeds: [embed] });
  },
};
