const { EmbedBuilder } = require('discord.js');
const { getLevel } = require('./database');

module.exports = {
  name: 'userinfo',
  description: 'Get user information',
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(user.id);
    const level = getLevel(user.id, message.guild.id);

    const embed = new EmbedBuilder()
      .setColor(member.displayHexColor || 0x5865F2)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 128 }))
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Status', value: member.presence ? member.presence.status : 'offline', inline: true },
        { name: 'Joined', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: 'Registered', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Level', value: level.level.toString(), inline: true },
        { name: 'XP', value: level.xp.toString(), inline: true },
        { name: `Roles [${member.roles.cache.size - 1}]`, value: member.roles.cache.filter(r => r.id !== message.guild.id).map(r => r.name).join(', ') || 'None' }
      )
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
