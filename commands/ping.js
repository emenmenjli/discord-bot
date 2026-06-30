module.exports = {
  name: 'ping',
  description: 'Check bot latency',
  async execute(message) {
    const sent = await message.channel.send('Pong!');
    sent.edit(`Pong! 🏓\nLatency: \`${sent.createdTimestamp - message.createdTimestamp}ms\`\nAPI Latency: \`${Math.round(message.client.ws.ping)}ms\``);
  },
};
