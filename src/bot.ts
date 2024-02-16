import * as discord from 'discord.js';
const { Client, Intents} = discord;
const client = new Client({ intents:
        [Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILDS]
});
import {MongoUtil} from "./util/mongoUtil.js";

import config from './config.json' assert {type: "json"};
import * as fs from 'fs';
client.commands = new discord.Collection()
client.queue = new Map()
client.prefix = new Map()
import appEndpoints from './WebServer/Services/AppEndpoints.js';
appEndpoints.startEndpoints(client);
import {logger} from "./logger.js";

const getDirectories = fs.readdirSync('./commands', { withFileTypes: true }).filter(dirent => dirent.isDirectory())
                        .map(dirent => dirent.name)
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for(const file of commandFiles)
{
    const command = await import(`./commands/${file}`)
    client.commands.set(command.name, command)
}

for(const directory of getDirectories)
{
    const commandFiles = fs.readdirSync(`./commands/${directory}`).filter(file => file.endsWith('.js'))
    for(const file of commandFiles)
    {
        const command = Object.values(await import(`./commands/${directory}/${file}`))[0] as {commandName: string, description: string, aliases: string[], execute: (message: string, args: string[]) => void};
        if (command?.commandName != null) {
            client.commands.set(command.commandName, command);
        } else {
            logger.error(`Error setting the command with module: ${JSON.stringify(command)}`);
        }

    }
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = Object.values(await import(`./events/${file}`))[0] as {commandName: string, once: boolean, execute: (...args: any) => void};
    if (event.once) {
        client.once(event.commandName, (...args) => event.execute(...args));
    } else {
        client.on(event.commandName, (...args) => event.execute(...args, client));
    }
}

MongoUtil.connectToServer(() =>
{
})

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
  });

client.login(config.token).then(val => logger.info("Bot logged into Discord Bot Client"))
    .catch(err => logger.error("Failed to login to the Discord Bot Client: " + err));
