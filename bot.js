const discord = require('discord.js')
const client = new discord.Client
const mongoUtil = require('./util/mongoUtil')
const economy = require('./economy')
const admin = require('./admin')
const config = require('./config.json')
const music = require('./music.js')
const googleSearch = require('./googleSearch.js')
const fs = require('fs')
const getPrefix = require('./util/getPrefix')
const setPrefix = require('./commands/admin/setPrefix')
client.commands = new discord.Collection()
client.queue = new Map()



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

client.on("voiceStateUpdate", (oldState, newState) =>
{
    if(newState.channel === null && newState.member.id === "703427817009840188") 
    {
        client.queue.delete(oldState.guild.id)
    }
})


//event that is ran when a new message is received
client.on('message', async message => 
{
    temp = ['']
    prefix = await getPrefix.execute(message, temp)
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
client.login(config.token)
