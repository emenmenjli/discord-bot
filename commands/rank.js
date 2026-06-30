const { EmbedBuilder } = require('discord.js');
const { getLevel } = require('../data/database');

module.exports = {
  name: 'rank',
  description: 'Check your or another user\'s XP/level',
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    const data = getLevel(user.id, message.guild.id);

    const currentLevelXp = data.level ** 2 * 100;
    const nextLevelXp = (data.level + 1) ** 2 * 100;
    const progress = currentLevelXp > 0 ? ((data.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100 : 0;

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setDescription([
        `**Level:** ${data.level}`,
        `**XP:** ${data.xp} / ${nextLevelXp}`,
        `**Progress:** ${progress.toFixed(1)}%`,
      ].join('\n'))
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
