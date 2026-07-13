const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { addCase, getCasesByType, clearCases } = require('./database');

module.exports = {
  name: 'warn',
  description: 'Warn a member',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply('❌ You need `Moderate Members` permission.');
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Please mention a user to warn.');

    const reason = args.slice(1).join(' ') || 'No reason provided';
    const caseId = addCase(message.guild.id, user.id, message.author.id, 'warn', reason);

    const warnCount = getCasesByType(message.guild.id, user.id, 'warn').length;

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle('⚠️ Member Warned')
      .addFields(
        { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
        { name: 'Moderator', value: message.author.tag, inline: true },
        { name: 'Reason', value: reason },
        { name: 'Case', value: `#${caseId}`, inline: true },
        { name: 'Total Warns', value: `${warnCount}`, inline: true }
      )
      .setTimestamp();

    if (warnCount >= 3) {
      const member = message.guild.members.cache.get(user.id);
      if (member && member.moderatable) {
        await member.timeout(600000, 'Auto-punishment: Reached 3 warns');
        clearCases(message.guild.id, user.id, 'warn');
        embed.addFields({ name: '⏱️ Auto-Punishment', value: `User reached **3 warns** and has been timed out for **10 minutes**. Warns cleared.` });
      } else {
        embed.addFields({ name: '⏱️ Auto-Punishment', value: `User reached **3 warns** but could not be timed out (not in server or not modifiable).` });
      }
    }

    message.channel.send({ embeds: [embed] });
  },
};
