const discord = require('discord.js')
const client = new discord.Client
const mongoUtil = require('./util/mongoUtil')
const config = require('./config.json')
const fs = require('fs')
const getPrefix = require('./util/getPrefix')
const setPrefix = require('./commands/admin/setPrefix')
client.commands = new discord.Collection()
client.queue = new Map()
client.prefix = new Map()



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


client.on('ready', () => 
{
    client.user.setPresence(
        { activity: 
            { 
            name: 'Rainbow Six Siege youtube.com/watch?v=NCRRt9izjP4', 
            type: "WATCHING", 
            }, status: 'online' }).then()
    .catch(console.error)
})

client.on("voiceStateUpdate", async (oldState, newState) =>
{
    general = await client.channels.fetch("760697529166987294")
    if(newState.channel === null && newState.member.id === "703427817009840188") 
    {
        client.queue.delete(oldState.guild.id)
    }

    else if(newState.channel === null)
    {
        general.send(newState.member.user.tag + " has left the voice channel")
    }

    else if(oldState.channel === null)
        general.send(newState.member.user.tag + " has joined the voice channel")
    
    let serverQueue
    if(oldState.channel)
        serverQueue = oldState.channel.client.queue.get(oldState.channel.guild.id)
    if(serverQueue)
    {
        if(serverQueue.voiceChannel.members.array().length === 1 && serverQueue.voiceChannel.members.array()[0].id === "703427817009840188")
        {
            serverQueue = serverQueue.voiceChannel.client.queue.get(serverQueue.voiceChannel.guild.id)
            if(serverQueue.connection.dispatcher.paused)
                serverQueue.connection.dispatcher.resume()
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
        }
    }
    
})


//event that is ran when a new message is received
client.on('message', async message => 
{
    if(!message.client.prefix.get(message.guild.id))
    {
        prefix = await getPrefix.execute(message)
        message.client.prefix.set(message.guild.id, prefix)
    }
        
    else
    {
        prefix = message.client.prefix.get(message.guild.id)
    }
        
    await client.commands.get("archiveMessages").execute(message)
    client.commands.get("archiveDeletion").execute(message)

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
