const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ name: '🔧 shelp for commands', type: ActivityType.Custom }],
      status: 'online',
    });

    for (const [, guild] of client.guilds.cache) {
      const { upsertGuild, getGuild, updateGuild } = require('../data/database');
      upsertGuild(guild.id);
      const settings = getGuild(guild.id);
      if (settings && settings.prefix === '!') {
        updateGuild(guild.id, { prefix: 's' });
      }
    }
  },
};
