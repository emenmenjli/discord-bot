const { EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const { getGuild } = require('./database');

module.exports = {
  name: 'ticket',
  description: 'Create a support ticket',
  async execute(message, args) {
    const guild = getGuild(message.guild.id);
    if (!guild || !guild.ticket_category) {
      return message.reply('❌ Tickets are not configured. Ask an admin to set a ticket category in the dashboard.');
    }

    const category = message.guild.channels.cache.get(guild.ticket_category);
    if (!category) {
      return message.reply('❌ The ticket category has been deleted. Ask an admin to fix it.');
    }

    const existing = message.guild.channels.cache.find(
      (c) => c.parentId === guild.ticket_category && c.topic === `ticket-${message.author.id}`
    );
    if (existing) {
      return message.reply(`❌ You already have an open ticket: ${existing}`);
    }

    const staffRoles = JSON.parse(guild.ticket_staff_roles || '[]');
    const perms = [
      {
        id: message.guild.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: message.author.id,
        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
      },
    ];
    for (const roleId of staffRoles) {
      perms.push({
        id: roleId,
        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
      });
    }

    const topic = args.join(' ') || 'No reason provided';
    const channel = await message.guild.channels.create({
      name: `ticket-${message.author.username}`,
      type: ChannelType.GuildText,
      parent: guild.ticket_category,
      topic: `ticket-${message.author.id}`,
      permissionOverwrites: perms,
    });

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('🎫 New Ticket')
      .setDescription(`Ticket created by ${message.author}\n**Reason:** ${topic}\n\nStaff will be with you shortly.`)
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    await message.reply(`✅ Ticket created: ${channel}`);
  },
};
