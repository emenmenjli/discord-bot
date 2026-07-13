require('dotenv').config();

module.exports = {
  token: process.env.BOT_TOKEN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  sessionSecret: process.env.SESSION_SECRET || 'default_secret_change_me',
  dashboardUrl: process.env.DASHBOARD_URL || 'http://localhost:3000',
  prefix: process.env.PREFIX || 's',
};
