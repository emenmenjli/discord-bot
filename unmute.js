const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'unmute',
  description: 'Remove timeout from a member',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply('❌ You need `Moderate Members` permission.');
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Please mention a user to unmute.');

    const member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply('❌ User not found.');

    if (member.communicationDisabledUntilTimestamp === null) {
      return message.reply('❌ That user is not muted.');
    }

    await member.timeout(null);
    message.channel.send(`✅ **${user.tag}** has been unmuted.`);
  },
};
