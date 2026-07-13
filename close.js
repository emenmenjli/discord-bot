const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'close',
  description: 'Close a ticket channel',
  async execute(message) {
    const topic = message.channel.topic;
    if (!topic || !topic.startsWith('ticket-')) {
      return message.reply('❌ This is not a ticket channel.');
    }

    const userId = topic.replace('ticket-', '');
    const isCreator = message.author.id === userId;
    const isStaff = message.member.permissions.has(PermissionsBitField.Flags.ManageChannels);

    if (!isCreator && !isStaff) {
      return message.reply('❌ Only the ticket creator or staff can close this ticket.');
    }

    await message.channel.send('🔒 Channel will be deleted in 5 seconds...');
    setTimeout(() => message.channel.delete().catch(() => {}), 5000);
  },
};
