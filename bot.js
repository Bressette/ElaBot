const discord = require('discord.js');
const { Client, Intents} = discord;
const client = new Client({ intents:
        [Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILDS]
});
const mongoUtil = require('./util/mongoUtil')
const config = require('./config.json')
const fs = require('fs')
client.commands = new discord.Collection()
client.queue = new Map()
client.prefix = new Map()
require('./WebServer/Services/AppEndpoints')(client);
const logger = require('logger');


const getDirectories = fs.readdirSync('./commands', { withFileTypes: true }).filter(dirent => dirent.isDirectory())
                        .map(dirent => dirent.name)
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for(const file of commandFiles)
{
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}

for(const directory of getDirectories)
{
    const commandFiles = fs.readdirSync(`./commands/${directory}`).filter(file => file.endsWith('.js'))
    for(const file of commandFiles)
    {
        const command = require(`./commands/${directory}/${file}`)
        client.commands.set(command.name, command)
    }
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

mongoUtil.connectToServer(() =>
{
})

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
  });

client.login(config.token).then(val => logger.info("Bot logged into Discord Bot Client"))
    .catch(err => logger.error("Failed to login to the Discord Bot Client: " + err));
