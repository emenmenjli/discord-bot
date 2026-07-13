const { EmbedBuilder } = require('discord.js');
const { getLeaderboard } = require('./database');

module.exports = {
  name: 'leaderboard',
  description: 'Show the server XP leaderboard',
  async execute(message) {
    const top = getLeaderboard(message.guild.id, 10);

    if (top.length === 0) {
      return message.channel.send('No one has earned XP yet. Start chatting!');
    }

    const lines = top.map((entry, i) => {
      const member = message.guild.members.cache.get(entry.user_id);
      const name = member ? member.user.tag : entry.user_id;
      return `**${i + 1}.** ${name} — Level **${entry.level}** (${entry.xp} XP)`;
    });

    const embed = new EmbedBuilder()
      .setColor(0xF1C40F)
      .setTitle('🏆 Leaderboard')
      .setDescription(lines.join('\n'))
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
