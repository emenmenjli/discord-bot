const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const path = require('path');
const config = require('./config');
const {
  getGuild, updateGuild, getCommands, addCommand, removeCommand,
  getAutoroles, addAutorole, removeAutorole, getLeaderboard,
} = require('./database');

const app = express();

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', __dirname);

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
  res.redirect('/login');
}

function getClient() {
  try {
    return require('./bot');
  } catch {
    return null;
  }
}

// Auth routes
app.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

// Pages
app.get('/', (req, res) => {
  res.render('index', { user: req.user, bot: getClient()?.user || null });
});

app.get('/dashboard', isAuth, async (req, res) => {
  const client = getClient();
  const guilds = [];
  if (client) {
    for (const [id, guild] of client.guilds.cache) {
      const member = guild.members.cache.get(req.user.id);
      if (member && (member.permissions.has('ManageGuild') || member.permissions.has('Administrator'))) {
        guilds.push({
          id: guild.id,
          name: guild.name,
          icon: guild.iconURL({ size: 64 }),
          memberCount: guild.memberCount,
        });
      }
    }
  }
  res.render('dashboard', { user: req.user, guilds });
});

app.get('/dashboard/:guildId', isAuth, async (req, res) => {
  const client = getClient();
  const guild = client?.guilds.cache.get(req.params.guildId);
  if (!guild) return res.status(404).send('Guild not found or bot not in guild.');

  const member = guild.members.cache.get(req.user.id);
  if (!member || !(member.permissions.has('ManageGuild') || member.permissions.has('Administrator'))) {
    return res.status(403).send('You do not have permission to manage this server.');
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

  res.render('settings', {
    user: req.user,
    guild,
    settings,
    commands,
    autoroles,
    leaderboard,
    roles,
    channels,
  });
});

// API Endpoints
app.post('/api/guild/:guildId/settings', isAuth, (req, res) => {
  updateGuild(req.params.guildId, req.body);
  res.redirect(`/dashboard/${req.params.guildId}`);
});

app.post('/api/guild/:guildId/commands', isAuth, (req, res) => {
  const { name, response, embed, allowed_roles } = req.body;
  const embedData = embed ? JSON.parse(embed) : null;
  const roles = allowed_roles ? (Array.isArray(allowed_roles) ? allowed_roles : [allowed_roles]) : [];
  addCommand(req.params.guildId, name, response, embedData, roles);
  res.redirect(`/dashboard/${req.params.guildId}`);
});

app.post('/api/guild/:guildId/commands/:commandId/delete', isAuth, (req, res) => {
  const { getCommand } = require('./database');
  const cmd = getCommand(req.params.guildId, req.params.commandId);
  if (cmd) {
    removeCommand(req.params.guildId, cmd.name);
  }
  res.redirect(`/dashboard/${req.params.guildId}`);
});

app.post('/api/guild/:guildId/autoroles', isAuth, (req, res) => {
  const { role_id } = req.body;
  if (role_id) {
    addAutorole(req.params.guildId, role_id);
  }
  res.redirect(`/dashboard/${req.params.guildId}`);
});

app.post('/api/guild/:guildId/autoroles/:roleId/delete', isAuth, (req, res) => {
  removeAutorole(req.params.guildId, req.params.roleId);
  res.redirect(`/dashboard/${req.params.guildId}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 Dashboard running at http://localhost:${PORT}`);
});

module.exports = app;
