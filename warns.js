const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { getCasesByType } = require('./database');

module.exports = {
  name: 'warns',
  description: 'View warns for a user',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply('❌ You need `Moderate Members` permission.');
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Mention a user to see their warns.');

    const warns = getCasesByType(message.guild.id, user.id, 'warn');
    if (warns.length === 0) {
      return message.reply(`✅ **${user.tag}** has no warns.`);
    }

    const lines = warns.map((w) => {
      const mod = message.client.users.cache.get(w.moderator_id);
      return `\`#${w.id}\` ${w.reason} — <@${w.moderator_id}>`;
    });

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle(`⚠️ Warns for ${user.tag}`)
      .setDescription(lines.join('\n'))
      .setFooter({ text: `${warns.length} warn(s) total` })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
