const discord = require('discord.js')
const client = new discord.Client
const mongoUtil = require('./mongoUtil.js')
const economy = require('./economy')
const admin = require('./admin')
const token = require('./token.json')
const copyPastas = require('./copy-pastas.json')

mongoUtil.connectToServer(() =>
{
})

slotSize = 5

client.on('ready', () => 
{
    client.user.setPresence(
        { activity: 
            { name: 'Rainbow Six Siege', 
            type: "WATCHING", 
            url: 'https://www.youtube.com/channel/UCDsShdUQolkO3N0bn6VcTNg'}, status: 'online' }).then()
    .catch(console.error)
 })

client.on('message', message => {
    
    userTag = message.member.user.tag
    userId = message.member.user.id
    content = message.content

    //changes all characters to lower case to allow the commands to not be case sensitive
    content = content.toLowerCase()
    
    
    //check if content starts with the command prefix e!
    if(content.trim().startsWith("e!", 0)) 
    {
        //removes e! from the content string
        content = content.substr(2, content.length).trim()

        //create a command string to hold the command keyword
        command = content
        if(command.includes(" ")) 
        {
            command = command.substr(0, content.indexOf(" "))
        }

        //switch statement to determine what command the user used
        switch(command) 
        {
            case "daily":
                economy.daily(userId, message, 5000)
                break
            case "balance":
                economy.messageCurrentBalance(userId, message)
                break
            case "coinflip":
                economy.coinflip(content, message, userId)
                break
            case "slots":
                economy.slots(content, message, userId, slotSize)
                break
            case "give":
                economy.give(content, message, userId)
                break
            case "leaderboard":
                economy.leaderboard(message, client)
                break
            case "slotsize":
                slotSize = economy.slotSize(content, message, slotSize)
                break
            case "getslotsize":
                message.channel.send("The slot size is: " + slotSize)
                break
            case "kick":
                admin.kick(message)
                break
            case "ban":
                admin.ban(message)
                break
            case "sekiro":
                message.channel.send(copyPastas.sekiro)
                break
        }
    }
})

client.login(token.token)
