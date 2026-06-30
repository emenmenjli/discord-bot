const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { addCase } = require('../data/database');

module.exports = {
  name: 'kick',
  description: 'Kick a member from the server',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply('❌ You need `Kick Members` permission.');
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Please mention a user to kick.');

    const member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply('❌ User not found in this server.');
    if (!member.kickable) return message.reply('❌ I cannot kick that user.');

    const reason = args.slice(1).join(' ') || 'No reason provided';

    await member.kick(reason);
    const caseId = addCase(message.guild.id, user.id, message.author.id, 'kick', reason);

    const embed = new EmbedBuilder()
      .setColor(0xFFA500)
      .setTitle('👢 Member Kicked')
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
