const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { addCase } = require('./database');

module.exports = {
  name: 'ban',
  description: 'Ban a member from the server',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('❌ You need `Ban Members` permission.');
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Please mention a user to ban.');

    const member = message.guild.members.cache.get(user.id);
    if (member && !member.bannable) return message.reply('❌ I cannot ban that user.');

    const reason = args.slice(1).join(' ') || 'No reason provided';

    await message.guild.members.ban(user.id, { reason });
    const caseId = addCase(message.guild.id, user.id, message.author.id, 'ban', reason);

    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setTitle('🔨 Member Banned')
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
