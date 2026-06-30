const config = require('../config');
const { getCommand, incrementCommandUsage, addXp, getGuild, upsertGuild } = require('../data/database');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    try {
    if (message.author.bot || !message.guild) return;

    upsertGuild(message.guild.id);
    addXp(message.author.id, message.guild.id, 5);

    const guild = getGuild(message.guild.id);
    const prefix = (guild && guild.prefix) || config.prefix;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!commandName) return;

    const command = getCommand(message.guild.id, commandName);

    if (!command) {
      const builtin = loadBuiltinCommand(commandName);
      if (builtin) {
        try {
          await builtin.execute(message, args, prefix);
        } catch (err) {
          console.error(`Error executing builtin command ${commandName}:`, err);
          message.reply('An error occurred while executing that command.').catch(() => {});
        }
      }
      return;
    }

    const allowedRoles = command.allowed_roles ? JSON.parse(command.allowed_roles) : [];
    if (allowedRoles.length > 0) {
      const hasRole = message.member.roles.cache.some((r) => allowedRoles.includes(r.id));
      if (!hasRole) {
        return message.reply('❌ You do not have permission to use this command.').catch(() => {});
      }
    }

    incrementCommandUsage(command.id);

    if (command.embed) {
      const embedData = JSON.parse(command.embed);
      try {
        await message.channel.send({ embeds: [embedData] });
      } catch (e) {
        await message.channel.send(command.response || 'Error sending embed.');
      }
    } else if (command.response) {
      const response = command.response
        .replace(/{user}/g, `<@${message.author.id}>`)
        .replace(/{user.name}/g, message.author.username)
        .replace(/{server}/g, message.guild.name)
        .replace(/{channel}/g, message.channel.name)
        .replace(/{args}/g, args.join(' '));

      await message.channel.send(response);
    }
    } catch (err) {
      console.error('Error in messageCreate:', err);
    }
  },
};

function loadBuiltinCommand(name) {
  try {
    return require(`../commands/${name}`);
  } catch {
    return null;
  }
}
