const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'clear',
  description: 'Clear messages in the channel',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply('❌ You need `Manage Messages` permission.');
    }

    const amount = parseInt(args[0]);
    if (!amount || amount < 1 || amount > 100) {
      return message.reply('❌ Please specify a number between 1 and 100.');
    }

    await message.delete().catch(() => {});
    const deleted = await message.channel.bulkDelete(amount, true);
    const reply = await message.channel.send(`🗑️ Deleted **${deleted.size}** messages.`);
    setTimeout(() => reply.delete().catch(() => {}), 3000);
  },
};
