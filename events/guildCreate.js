module.exports = {
  name: 'guildCreate',
  execute(guild) {
    const { upsertGuild } = require('../data/database');
    upsertGuild(guild.id);
    console.log(`📥 Joined guild: ${guild.name} (${guild.id})`);
  },
};
