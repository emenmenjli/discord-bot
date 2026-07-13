const { PermissionsBitField } = require('discord.js');
const { clearCases } = require('./database');

module.exports = {
  name: 'clearwarns',
  description: 'Clear all warns for a user',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You need `Administrator` permission.');
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention a user to clear warns.');

    clearCases(message.guild.id, user.id, 'warn');
    message.reply(`✅ Cleared all warns for **${user.tag}**.`);
  },
};
