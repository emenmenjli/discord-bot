const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const { getGuild, getCasesByType, clearCases } = require('./database');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'create_ticket') {
      await handleCreateTicket(interaction);
    } else if (interaction.customId === 'close_ticket') {
      await handleCloseTicket(interaction);
    } else if (interaction.customId === 'claim_ticket') {
      await handleClaimTicket(interaction);
    }
  },
};

async function handleCreateTicket(interaction) {
  const guild = getGuild(interaction.guild.id);
  if (!guild || !guild.ticket_category) {
    return interaction.reply({ content: '❌ Tickets are not configured. Ask an admin to set a ticket category in the dashboard.', ephemeral: true });
  }

  const category = interaction.guild.channels.cache.get(guild.ticket_category);
  if (!category) {
    return interaction.reply({ content: '❌ The ticket category has been deleted. Ask an admin to fix it.', ephemeral: true });
  }

  const existing = interaction.guild.channels.cache.find(
    (c) => c.parentId === guild.ticket_category && c.topic === `ticket-${interaction.user.id}`
  );
  if (existing) {
    return interaction.reply({ content: `❌ You already have an open ticket: ${existing}`, ephemeral: true });
  }

  const staffRoles = JSON.parse(guild.ticket_staff_roles || '[]');
  const perms = [
    {
      id: interaction.guild.id,
      deny: [PermissionsBitField.Flags.ViewChannel],
    },
    {
      id: interaction.user.id,
      allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
    },
  ];
  for (const roleId of staffRoles) {
    perms.push({
      id: roleId,
      allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
    });
  }

  const channel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.username}`,
    type: ChannelType.GuildText,
    parent: guild.ticket_category,
    topic: `ticket-${interaction.user.id}`,
    permissionOverwrites: perms,
  });

  const closeRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('Close Ticket')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔒'),
    new ButtonBuilder()
      .setCustomId('claim_ticket')
      .setLabel('Claim')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('✋')
  );

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('🎫 New Ticket')
    .setDescription(`Ticket created by ${interaction.user}\n\nStaff will be with you shortly. Use the buttons below to close or claim this ticket.`)
    .setTimestamp();

  await channel.send({ content: `${staffRoles.map((r) => `<@&${r}>`).join(' ')}`, embeds: [embed], components: [closeRow] });
  await interaction.reply({ content: `✅ Ticket created: ${channel}`, ephemeral: true });
}

async function handleCloseTicket(interaction) {
  const topic = interaction.channel.topic;
  if (!topic || !topic.startsWith('ticket-')) {
    return interaction.reply({ content: '❌ This is not a ticket channel.', ephemeral: true });
  }

  const userId = topic.replace('ticket-', '');
  const isCreator = interaction.user.id === userId;
  const isStaff = interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels);

  if (!isCreator && !isStaff) {
    return interaction.reply({ content: '❌ Only the ticket creator or staff can close this ticket.', ephemeral: true });
  }

  await interaction.reply({ content: '🔒 Closing ticket in 5 seconds...' });
  setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
}

async function handleClaimTicket(interaction) {
  const topic = interaction.channel.topic;
  if (!topic || !topic.startsWith('ticket-')) {
    return interaction.reply({ content: '❌ This is not a ticket channel.', ephemeral: true });
  }

  if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
    return interaction.reply({ content: '❌ Only staff can claim tickets.', ephemeral: true });
  }

  await interaction.channel.setName(`claimed-${interaction.channel.name}`);
  await interaction.reply({ content: `✋ Ticket claimed by ${interaction.user}` });
}
