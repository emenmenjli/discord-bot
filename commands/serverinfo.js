const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'serverinfo',
  description: 'Get server information',
  async execute(message) {
    const guild = message.guild;
    const owner = await guild.fetchOwner();
    const channels = guild.channels.cache;
    const bots = guild.members.cache.filter((m) => m.user.bot).size;

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 128 }))
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .addFields(
        { name: 'Owner', value: owner.user.tag, inline: true },
        { name: 'Members', value: `${guild.memberCount} (${bots} bots)`, inline: true },
        { name: 'Channels', value: `${channels.filter(c => c.type === 0).size} Text | ${channels.filter(c => c.type === 2).size} Voice`, inline: true },
        { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
        { name: 'Boost Level', value: guild.premiumTier.toString(), inline: true },
        { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
      )
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
