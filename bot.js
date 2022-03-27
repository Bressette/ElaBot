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
const getPrefix = require('./util/getPrefix')
const setPrefix = require('./commands/admin/setPrefix')
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const serverManagement = require('./WebServer/Services/ServerManagement.js');
const {fetchServerById, fetchServerMessagesByChannelId} = require("./WebServer/Services/ServerManagement");
const app = express();
const port = 8093
const insertMessages = require('./util/storeMessages');
const {fetchMembersByServerId} = require("./WebServer/Services/ServerManagement");
client.commands = new discord.Collection()
client.queue = new Map()
client.prefix = new Map()


//endpoints used to retrieve server info for connected servers
app.get('/discord/channels/:serverId', async (req, res) => {
    const channels = await serverManagement.fetchChannelsByServerId(req.params.serverId, client);
    res.json(channels);
});

app.get('/discord/servers', async (req, res) => {
    const servers = await serverManagement.fetchServers(client);
    console.log(`Retrieved servers: ${servers.size}`)
    const outputJson = JSON.stringify(servers, (key, value) =>
        typeof value === "bigint" ? value.toString() + "n" : value
    );
    res.setHeader('Content-Type', 'application/json');
    res.end(outputJson);
});

app.get('/discord/server/icon/:serverId', async(req, res) => {
    res.json({iconUrl: await serverManagement.fetchServerIconLink(client, req.params.serverId)});
});

app.get('/discord/server/:serverId', async (req, res) => {
    res.json(await fetchServerById(client, req.params.serverId));
});

app.get('/discord/server/:serverId/members', async (req, res) => {
    res.json(await fetchMembersByServerId(client, req.params.serverId));
});

// implement mongodb find to retrieve the messages for a certain channel in a server
app.get('/discord/messages/:serverId/:channelId/:messageCount', async (req, res) => {
    res.json(await fetchServerMessagesByChannelId(req.params.serverId, req.params.channelId, req.params.messageCount));
})

app.post('/discord/message/:serverId/:channelId', jsonParser, async (req, res) => {
    await serverManagement.postMessage(client, req.params.serverId, req.params.channelId, req.body.message);
    res.sendStatus(200);
})

app.get('/discord/copy', async (req, res) => {
    await serverManagement.copyServerContents(req.query.sourceGuildId, req.query.targetGuildId, client);
})
app.listen(port, () => {
    console.log(`App listening at port: ${port}`);
})

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


mongoUtil.connectToServer(() =>
{
})


client.on('ready', async () => 
{
    client.user.setPresence(
        { activities:
                [{
                    name: 'Rainbow Six Siege youtube.com/watch?v=NCRRt9izjP4',
                    type: "WATCHING",
                }],
            status: 'online' })
})

client.on("voiceStateUpdate", async (oldState, newState) =>
{
    if(newState.channel === null && newState.member.id === "703427817009840188") 
    {
        client.queue.delete(oldState.guild.id)
    }
    
    let serverQueue
    if(oldState.channel)
        serverQueue = oldState.channel.client.queue.get(oldState.channel.guild.id)
    if(serverQueue)
    {
        if(serverQueue.voiceChannel.members.size === 1 && serverQueue.voiceChannel.members.first().id === "703427817009840188")
        {
            serverQueue = serverQueue.voiceChannel.client.queue.get(serverQueue.voiceChannel.guild.id)
            serverQueue.songs = [];
            serverQueue.connection?.destroy();
        }
    }
    
})


//event that is ran when a new message is received
client.on('messageCreate', async message =>
{
    console.log(message.content);

    await insertMessages.execute(Array.of(message));
    
    if(!message.client.prefix.get(message.guild.id))
    {
        prefix = await getPrefix.execute(message)
        message.client.prefix.set(message.guild.id, prefix)
    }
        
    else
    {
        prefix = message.client.prefix.get(message.guild.id)
    }

    if(message.content.includes("printprefix"))
    {
        message.channel.send(`The current prefix is ${prefix}`)
    }

    if(message.content.includes("resetprefix"))
    {
        reset = "-"
        message.content = "-"
        temp = ['-']
        setPrefix.execute(message, temp)
    }

    if(message.author.bot || !message.content.trim().startsWith(prefix))
        return
    

    //check if message starts with the command prefix
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()
    message.content = message.content.substr(prefix.length, message.content.length).trim()
    

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if(!command)
        return

    try {
        await command.execute(message, args)
    } catch(error) {
        console.error(error)
    }

})

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
  });
client.login(config.token)
