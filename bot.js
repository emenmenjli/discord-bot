const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
  ],
});

client.commands = new Collection();

const events = [
  require('./ready'),
  require('./messageCreate'),
  require('./guildCreate'),
  require('./guildMemberAdd'),
  require('./guildMemberRemove'),
];

for (const event of events) {
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(config.token);

module.exports = client;
