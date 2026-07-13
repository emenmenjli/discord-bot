const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { addCase } = require('./database');

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

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle('⚠️ Member Warned')
      .addFields(
        { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
        { name: 'Moderator', value: message.author.tag, inline: true },
        { name: 'Reason', value: reason },
        { name: 'Case', value: `#${caseId}`, inline: true }
      )
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
