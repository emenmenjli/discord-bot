const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const path = require('path');
const config = require('../config');
const {
  getGuild, updateGuild, getCommands, addCommand, removeCommand, getCommand,
  getAutoroles, addAutorole, removeAutorole, getLeaderboard,
} = require('../database');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
  clientID: config.clientId,
  clientSecret: config.clientSecret,
  callbackURL: `${config.dashboardUrl}/auth/callback`,
  scope: ['identify', 'guilds'],
}, (accessToken, refreshToken, profile, done) => {
  process.nextTick(() => done(null, profile));
}));

function isAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

function getClient() {
  try { return require('../bot'); } catch { return null; }
}

// Auth
app.get('/login', (req, res) => {
  res.redirect('/auth/discord');
});

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => { res.redirect('/dashboard'); }
);

app.get('/logout', (req, res, next) => {
  req.logout((err) => { if (err) return next(err); res.redirect('/'); });
});

// API: get user info (public — returns null when not authenticated)
app.get('/api/user', (req, res) => {
  if (!req.isAuthenticated()) return res.json(null);
  res.json({ id: req.user.id, username: req.user.username, avatar: req.user.avatar });
});

// API: get user's manageable guilds
app.get('/api/guilds', isAuth, (req, res) => {
  const client = getClient();
  const guilds = [];
  if (client) {
    for (const [, guild] of client.guilds.cache) {
      const member = guild.members.cache.get(req.user.id);
      if (member && (member.permissions.has('ManageGuild') || member.permissions.has('Administrator'))) {
        guilds.push({
          id: guild.id, name: guild.name,
          icon: guild.iconURL({ size: 64 }),
          memberCount: guild.memberCount,
        });
      }
    }
  }
  res.json(guilds);
});

// API: get guild settings
app.get('/api/guild/:guildId', isAuth, (req, res) => {
  const client = getClient();
  const guild = client?.guilds.cache.get(req.params.guildId);
  if (!guild) return res.status(404).json({ error: 'Guild not found' });

  const member = guild.members.cache.get(req.user.id);
  if (!member || !(member.permissions.has('ManageGuild') || member.permissions.has('Administrator'))) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const settings = getGuild(guild.id) || {};
  const commands = getCommands(guild.id);
  const autoroles = getAutoroles(guild.id);
  const leaderboard = getLeaderboard(guild.id, 10);

  const roles = guild.roles.cache
    .filter((r) => r.id !== guild.id)
    .sort((a, b) => b.position - a.position)
    .map((r) => ({ id: r.id, name: r.name, color: r.hexColor }));

  const channels = guild.channels.cache
    .filter((c) => c.type === 0)
    .map((c) => ({ id: c.id, name: c.name }));

  const categories = guild.channels.cache
    .filter((c) => c.type === 4)
    .map((c) => ({ id: c.id, name: c.name }));

  res.json({
    guild: {
      id: guild.id, name: guild.name,
      icon: guild.iconURL({ size: 128 }),
      memberCount: guild.memberCount,
    },
    settings, commands, autoroles, leaderboard, roles, channels, categories,
  });
});

// API: update settings
app.patch('/api/guild/:guildId/settings', isAuth, (req, res) => {
  const body = { ...req.body };
  if (body.ticket_staff_roles && typeof body.ticket_staff_roles === 'string') {
    try { body.ticket_staff_roles = JSON.stringify(JSON.parse(body.ticket_staff_roles)); }
    catch { body.ticket_staff_roles = JSON.stringify([body.ticket_staff_roles]); }
  }
  updateGuild(req.params.guildId, body);
  res.json({ success: true });
});

// API: manage commands
app.post('/api/guild/:guildId/commands', isAuth, (req, res) => {
  const { name, response, embed, allowed_roles } = req.body;
  addCommand(req.params.guildId, name, response, embed || null, allowed_roles || []);
  res.json({ success: true });
});

app.delete('/api/guild/:guildId/commands/:name', isAuth, (req, res) => {
  removeCommand(req.params.guildId, req.params.name);
  res.json({ success: true });
});

// API: manage autoroles
app.post('/api/guild/:guildId/autoroles', isAuth, (req, res) => {
  addAutorole(req.params.guildId, req.body.role_id);
  res.json({ success: true });
});

app.delete('/api/guild/:guildId/autoroles/:roleId', isAuth, (req, res) => {
  removeAutorole(req.params.guildId, req.params.roleId);
  res.json({ success: true });
});

// API: role management
app.post('/api/guild/:guildId/roles', isAuth, (req, res) => {
  const client = getClient();
  const guild = client?.guilds.cache.get(req.params.guildId);
  if (!guild) return res.status(404).json({ error: 'Guild not found' });
  const { name, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  guild.roles.create({ name, color: color ? color.replace('#', '') : undefined, reason: `Created via dashboard by ${req.user.tag}` })
    .then((role) => res.json({ success: true, role: { id: role.id, name: role.name, color: role.hexColor } }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.patch('/api/guild/:guildId/roles/:roleId', isAuth, (req, res) => {
  const client = getClient();
  const guild = client?.guilds.cache.get(req.params.guildId);
  if (!guild) return res.status(404).json({ error: 'Guild not found' });
  const role = guild.roles.cache.get(req.params.roleId);
  if (!role) return res.status(404).json({ error: 'Role not found' });
  const updates = {};
  if (req.body.name) updates.name = req.body.name;
  if (req.body.color) updates.color = req.body.color.replace('#', '');
  role.set(updates, `Updated via dashboard by ${req.user.tag}`)
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.delete('/api/guild/:guildId/roles/:roleId', isAuth, (req, res) => {
  const client = getClient();
  const guild = client?.guilds.cache.get(req.params.guildId);
  if (!guild) return res.status(404).json({ error: 'Guild not found' });
  const role = guild.roles.cache.get(req.params.roleId);
  if (!role) return res.status(404).json({ error: 'Role not found' });
  role.delete(`Deleted via dashboard by ${req.user.tag}`)
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// API: get moderation cases
app.get('/api/guild/:guildId/cases', isAuth, (req, res) => {
  const { getCases, getCasesByType } = require('../database');
  const guildId = req.params.guildId;
  const userId = req.query.userId || null;
  const type = req.query.type || null;
  let cases;
  if (userId && type) {
    cases = getCasesByType(guildId, userId, type);
  } else if (userId) {
    cases = getCases(guildId, userId);
  } else {
    cases = getCases(guildId);
  }
  const client = getClient();
  const enriched = cases.slice(0, 30).map((c) => {
    const target = client?.users.cache.get(c.user_id);
    const mod = client?.users.cache.get(c.moderator_id);
    return {
      ...c,
      user_tag: target ? target.tag : c.user_id,
      moderator_tag: mod ? mod.tag : c.moderator_id,
    };
  });
  res.json(enriched);
});

app.delete('/api/guild/:guildId/cases/:userId/:type', isAuth, (req, res) => {
  const { clearCases } = require('../database');
  clearCases(req.params.guildId, req.params.userId, req.params.type);
  res.json({ success: true });
});

// Serve the SPA - all unmatched routes go to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Dashboard running at http://localhost:${PORT}`);
});

module.exports = app;
