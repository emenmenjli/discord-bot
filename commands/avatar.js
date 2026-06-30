const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Get a user\'s avatar',
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setImage(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
