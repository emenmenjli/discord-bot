const { getGuild } = require('../data/database');

module.exports = {
  name: 'guildMemberRemove',
  execute(member) {
    const guild = getGuild(member.guild.id);
    if (guild && guild.leave_channel && guild.leave_message) {
      const channel = member.guild.channels.cache.get(guild.leave_channel);
      if (channel) {
        const msg = guild.leave_message
          .replace(/{user}/g, `<@${member.id}>`)
          .replace(/{user.name}/g, member.user.username)
          .replace(/{server}/g, member.guild.name)
          .replace(/{count}/g, member.guild.memberCount);
        channel.send(msg).catch(() => {});
      }
    }
  },
};
