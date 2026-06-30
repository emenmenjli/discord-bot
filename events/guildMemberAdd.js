const { getAutoroles, getGuild } = require('../data/database');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const autoroles = getAutoroles(member.guild.id, 'join');
    for (const ar of autoroles) {
      try {
        const role = member.guild.roles.cache.get(ar.role_id);
        if (role && role.editable) {
          await member.roles.add(role);
        }
      } catch (e) {
        console.error(`Failed to add autorole ${ar.role_id} to ${member.id}:`, e.message);
      }
    }

    const guild = getGuild(member.guild.id);
    if (guild && guild.welcome_channel && guild.welcome_message) {
      const channel = member.guild.channels.cache.get(guild.welcome_channel);
      if (channel) {
        const msg = guild.welcome_message
          .replace(/{user}/g, `<@${member.id}>`)
          .replace(/{user.name}/g, member.user.username)
          .replace(/{server}/g, member.guild.name)
          .replace(/{count}/g, member.guild.memberCount);
        channel.send(msg).catch(() => {});
      }
    }
  },
};
