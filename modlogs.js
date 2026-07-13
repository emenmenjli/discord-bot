const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { getCases } = require('./database');

module.exports = {
  name: 'modlogs',
  description: 'View moderation logs',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply('❌ You need `Moderate Members` permission.');
    }

    const user = message.mentions.users.first();
    const cases = user
      ? getCases(message.guild.id, user.id)
      : getCases(message.guild.id);

    if (cases.length === 0) {
      return message.channel.send(user
        ? `No moderation cases for **${user.tag}**.`
        : 'No moderation cases in this server.'
      );
    }

    const recent = cases.slice(0, 15);
    const lines = recent.map((c) => {
      const moderator = message.client.users.cache.get(c.moderator_id);
      const modName = moderator ? moderator.tag : c.moderator_id;
      const target = message.client.users.cache.get(c.user_id);
      const targetName = target ? target.tag : c.user_id;
      return `\`#${c.id}\` **${c.type}** — ${targetName} — ${c.reason} — ${modName}`;
    });

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(user ? `Mod Logs for ${user.tag}` : 'Recent Mod Logs')
      .setDescription(lines.join('\n'))
      .setFooter({ text: `Showing ${recent.length} of ${cases.length} cases` })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
