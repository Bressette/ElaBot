const discord = require('discord.js')
const client = new discord.Client
const mongoUtil = require('./mongoUtil.js')
const economy = require('./economy')
const admin = require('./admin')
const config = require('./config.json')
const copyPastas = require('./copy-pastas.json')
const music = require('./music.js')
const googleSearch = require('./googleSearch.js')

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


client.on('message', async message => 
{
    prefix = await admin.getPrefix(message)

    if(message.author.id === "712443987801145355")
    {
        message.react("713172523424153610")
    }

    else if(message.author.id === "119482224713269248")
    {
        setTimeout(()=>
        {
            message.delete()
        }, 3000)
    }

    else
    {
        if(message.author.bot)
            return
    }
  
    userId = message.member.user.id
    content = message.content

    admin.linkManagement(message)

    if(message.content.includes("printprefix"))
    {
        message.channel.send(`The current prefix is ${prefix}`)
    }

    if(message.content.includes("resetprefix"))
    {
        reset = "prefix -"
        admin.setPrefix(message, reset)
    }
    

    //check if content starts with the command prefix
    if(content.trim().startsWith(prefix, 0)) 
    {
        content = content.substr(prefix.length, content.length).trim()

        //create a command string to hold the command keyword
        command = content.toLowerCase()
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
                economy.slots(content, message, userId)
                break
            case "give":
                economy.give(content, message, userId)
                break
            case "leaderboard":
                economy.leaderboard(message, client)
                break
            case "slotsize":
                economy.setSlotSize(content, message)
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
            case "mute":
                admin.mute(message)
                break
            case "unmute":
                admin.unMute(message)
                break
            case "deafen":
                admin.deafen(message)
                break
            case "undeafen":
                admin.unDeafen(message)
                break
            case "purge":
                admin.purge(message, content)
                break
            case "sekiro":
                message.channel.send(copyPastas.sekiro)
                break
            case "play":
                music.execute(message, content)
                break
            case "p":
                music.execute(message, content)
                break
            case "r":
                music.stop(message)
                break
            case "skip":
                music.skip(message)
                break
            case "reset":
                music.stop(message)
                break
            case "stop":
                music.stop(message)
                break
            case "pause":
                music.pause(message)
                break
            case "resume":
                music.resume(message)
                break
            case "prefix":
                admin.setPrefix(message, content)
                break
            case "link":
                message.channel.send("The bot authorization link is: https://discord.com/api/oauth2/authorize?client_id=703427817009840188&permissions=8&scope=bot")
                break
            case "imagesearch":
                googleSearch.search(message, content)
                break
            case "loop":
                music.setLoop(message)
                break
        }
    }
})

client.login(config.token)
