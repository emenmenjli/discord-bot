const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'role',
  description: 'Manage roles — give, remove, create, delete, rename, color, list',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply('❌ You need `Manage Roles` permission.');
    }

    const sub = (args.shift() || '').toLowerCase();
    const subcommands = {
      give: giveRole,
      remove: removeRole,
      create: createRole,
      delete: deleteRole,
      rename: renameRole,
      color: colorRole,
      list: listRoles,
    };

    if (!subcommands[sub]) {
      return message.reply(`❌ Unknown subcommand. Use: \`give\`, \`remove\`, \`create\`, \`delete\`, \`rename\`, \`color\`, \`list\``);
    }

    await subcommands[sub](message, args);
  },
};

async function giveRole(message, args) {
  const target = message.mentions.members.first();
  const role = message.mentions.roles.first();
  if (!target || !role) return message.reply('❌ Usage: `srole give @user @role`');
  if (role.position >= message.member.roles.highest.position && message.guild.ownerId !== message.author.id) {
    return message.reply('❌ You cannot assign a role higher than your highest role.');
  }
  if (!role.editable) return message.reply('❌ I cannot assign that role.');

  if (target.roles.cache.has(role.id)) return message.reply(`❌ ${target.user.tag} already has ${role}.`);

  await target.roles.add(role, `Role given by ${message.author.tag}`);
  message.channel.send(`✅ Gave ${role} to **${target.user.tag}**.`);
}

async function removeRole(message, args) {
  const target = message.mentions.members.first();
  const role = message.mentions.roles.first();
  if (!target || !role) return message.reply('❌ Usage: `srole remove @user @role`');
  if (role.position >= message.member.roles.highest.position && message.guild.ownerId !== message.author.id) {
    return message.reply('❌ You cannot remove a role higher than your highest role.');
  }
  if (!role.editable) return message.reply('❌ I cannot remove that role.');

  if (!target.roles.cache.has(role.id)) return message.reply(`❌ ${target.user.tag} does not have ${role}.`);

  await target.roles.remove(role, `Role removed by ${message.author.tag}`);
  message.channel.send(`✅ Removed ${role} from **${target.user.tag}**.`);
}

async function createRole(message, args) {
  const name = args.shift();
  if (!name) return message.reply('❌ Usage: `srole create <name> [hex color]`');

  const color = args.shift() || '#5865F2';
  const validHex = /^#?[0-9a-fA-F]{6}$/;
  if (!validHex.test(color)) return message.reply('❌ Invalid color. Use hex format, e.g. `#FF0000`.');

  const role = await message.guild.roles.create({
    name,
    color: color.replace('#', ''),
    reason: `Role created by ${message.author.tag}`,
  });

  message.channel.send(`✅ Created role ${role} with color **${color}**.`);
}

async function deleteRole(message, args) {
  const role = message.mentions.roles.first();
  if (!role) return message.reply('❌ Usage: `srole delete @role`');
  if (role.position >= message.member.roles.highest.position && message.guild.ownerId !== message.author.id) {
    return message.reply('❌ You cannot delete a role higher than your highest role.');
  }
  if (!role.editable) return message.reply('❌ I cannot delete that role.');

  await role.delete(`Role deleted by ${message.author.tag}`);
  message.channel.send(`✅ Deleted role **${role.name}**.`);
}

async function renameRole(message, args) {
  const role = message.mentions.roles.first();
  const newName = args.slice(1).join(' ');
  if (!role || !newName) return message.reply('❌ Usage: `srole rename @role <new name>`');
  if (role.position >= message.member.roles.highest.position && message.guild.ownerId !== message.author.id) {
    return message.reply('❌ You cannot rename a role higher than your highest role.');
  }
  if (!role.editable) return message.reply('❌ I cannot rename that role.');

  const oldName = role.name;
  await role.setName(newName, `Role renamed by ${message.author.tag}`);
  message.channel.send(`✅ Renamed **${oldName}** → **${newName}**.`);
}

async function colorRole(message, args) {
  const role = message.mentions.roles.first();
  const color = args[1];
  if (!role || !color) return message.reply('❌ Usage: `srole color @role <hex color>`');
  if (role.position >= message.member.roles.highest.position && message.guild.ownerId !== message.author.id) {
    return message.reply('❌ You cannot change color of a role higher than your highest role.');
  }
  if (!role.editable) return message.reply('❌ I cannot change that role.');

  const validHex = /^#?[0-9a-fA-F]{6}$/;
  if (!validHex.test(color)) return message.reply('❌ Invalid color. Use hex format, e.g. `#FF0000`.');

  await role.setColor(color.replace('#', ''), `Role color changed by ${message.author.tag}`);
  message.channel.send(`✅ Changed ${role} color to **${color}**.`);
}

async function listRoles(message) {
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
}
