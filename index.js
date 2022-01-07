const {Client , Collection } = require("discord.js");
const config = require("./config.js");
const client = new Client({disableEveryone: true, disabledEvents: ["TYPING_START"], intents: 32767, partials: ['MESSAGE', 'CHANNEL', 'REACTION']});
const events = require("./structures/event");
const command = require("./structures/slash");


client.commands = new Collection();
client.aliases = new Collection();
client.limits = new Map();
client.config = config;
command.run(client);
events.run(client)

client.login(config.token)