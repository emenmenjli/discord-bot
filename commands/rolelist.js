const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'rolelist',
  description: 'List all roles in the server',
  async execute(message) {
    const roles = message.guild.roles.cache
      .filter((r) => r.id !== message.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((r) => `<@&${r.id}>`);

    const chunks = [];
    for (let i = 0; i < roles.length; i += 30) {
      chunks.push(roles.slice(i, i + 30).join(' '));
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`Server Roles (${roles.length})`)
      .setDescription(chunks[0] || 'No roles')
      .setTimestamp();

    if (chunks.length > 1) {
      embed.setFooter({ text: `Page 1/${chunks.length}` });
    }

    message.channel.send({ embeds: [embed] });
  },
};
