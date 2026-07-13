const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname);
const FILE = path.join(DATA_DIR, 'bot-data.json');

function load() {
  try {
    const raw = fs.readFileSync(FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {
      guilds: {},
      commands: [],
      autoroles: [],
      leveling: [],
      cases: [],
    };
  }
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8');
}

function upsertGuild(guildId) {
  const data = load();
  if (!data.guilds[guildId]) {
    data.guilds[guildId] = {
      id: guildId,
      prefix: 's',
      welcome_channel: null,
      welcome_message: null,
      leave_channel: null,
      leave_message: null,
      mod_log_channel: null,
      leveling_enabled: false,
      ticket_category: null,
      ticket_staff_roles: '[]',
    };
    save(data);
  }
}

function getGuild(guildId) {
  const data = load();
  return data.guilds[guildId] || null;
}

function updateGuild(guildId, updates) {
  const data = load();
  if (!data.guilds[guildId]) data.guilds[guildId] = { id: guildId };
  const allowed = ['prefix', 'welcome_channel', 'welcome_message', 'leave_channel', 'leave_message', 'mod_log_channel', 'leveling_enabled', 'ticket_category', 'ticket_staff_roles'];
  for (const [key, val] of Object.entries(updates)) {
    if (allowed.includes(key)) {
      data.guilds[guildId][key] = val;
    }
  }
  save(data);
}

function addCommand(guildId, name, response, embed = null, allowedRoles = []) {
  const data = load();
  const existing = data.commands.findIndex((c) => c.guild_id === guildId && c.name.toLowerCase() === name.toLowerCase());
  const cmd = {
    id: Date.now() + Math.random(),
    guild_id: guildId,
    name,
    response,
    embed: embed ? JSON.stringify(embed) : null,
    allowed_roles: JSON.stringify(allowedRoles),
    usage_count: 0,
  };
  if (existing >= 0) {
    cmd.usage_count = data.commands[existing].usage_count || 0;
    data.commands[existing] = cmd;
  } else {
    data.commands.push(cmd);
  }
  save(data);
}

function removeCommand(guildId, name) {
  const data = load();
  data.commands = data.commands.filter((c) => !(c.guild_id === guildId && c.name.toLowerCase() === name.toLowerCase()));
  save(data);
}

function getCommand(guildId, name) {
  const data = load();
  return data.commands.find((c) => c.guild_id === guildId && c.name.toLowerCase() === name.toLowerCase()) || null;
}

function getCommands(guildId) {
  const data = load();
  return data.commands.filter((c) => c.guild_id === guildId).sort((a, b) => a.name.localeCompare(b.name));
}

function incrementCommandUsage(commandId) {
  const data = load();
  const cmd = data.commands.find((c) => c.id === commandId);
  if (cmd) {
    cmd.usage_count = (cmd.usage_count || 0) + 1;
    save(data);
  }
}

function addAutorole(guildId, roleId, type = 'join') {
  const data = load();
  const exists = data.autoroles.find((a) => a.guild_id === guildId && a.role_id === roleId);
  if (!exists) {
    data.autoroles.push({ id: Date.now() + Math.random(), guild_id: guildId, role_id: roleId, type });
    save(data);
  }
}

function removeAutorole(guildId, roleId) {
  const data = load();
  data.autoroles = data.autoroles.filter((a) => !(a.guild_id === guildId && a.role_id === roleId));
  save(data);
}

function getAutoroles(guildId, type = 'join') {
  const data = load();
  return data.autoroles.filter((a) => a.guild_id === guildId && a.type === type);
}

function addXp(userId, guildId, amount = 10) {
  const data = load();
  let entry = data.leveling.find((l) => l.user_id === userId && l.guild_id === guildId);
  let leveledUp = false;
  if (entry) {
    entry.xp += amount;
    const newLevel = Math.floor(0.1 * Math.sqrt(entry.xp));
    if (newLevel > entry.level) {
      leveledUp = true;
      entry.level = newLevel;
    }
  } else {
    entry = { user_id: userId, guild_id: guildId, xp: amount, level: 1 };
    data.leveling.push(entry);
  }
  save(data);
  return { xp: entry.xp, level: entry.level, leveledUp };
}

function getLevel(userId, guildId) {
  const data = load();
  return data.leveling.find((l) => l.user_id === userId && l.guild_id === guildId) || { xp: 0, level: 0 };
}

function getLeaderboard(guildId, limit = 10) {
  const data = load();
  return data.leveling
    .filter((l) => l.guild_id === guildId)
    .sort((a, b) => b.level - a.level || b.xp - a.xp)
    .slice(0, limit);
}

function addCase(guildId, userId, moderatorId, type, reason, duration = null) {
  const data = load();
  const c = {
    id: data.cases.length + 1,
    guild_id: guildId,
    user_id: userId,
    moderator_id: moderatorId,
    type,
    reason,
    duration,
  };
  data.cases.push(c);
  save(data);
  return c.id;
}

function getCases(guildId, userId = null) {
  const data = load();
  const cases = data.cases.filter((c) => c.guild_id === guildId);
  if (userId) return cases.filter((c) => c.user_id === userId).reverse();
  return cases.reverse();
}

module.exports = {
  upsertGuild,
  getGuild,
  updateGuild,
  addCommand,
  removeCommand,
  getCommand,
  getCommands,
  incrementCommandUsage,
  addAutorole,
  removeAutorole,
  getAutoroles,
  addXp,
  getLevel,
  getLeaderboard,
  addCase,
  getCases,
};
