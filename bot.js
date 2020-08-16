const discord = require('discord.js')
const client = new discord.Client
const mongoUtil = require('./mongoUtil.js')
const economy = require('./economy')
const admin = require('./admin')
const config = require('./config.json')
const copyPastas = require('./copy-pastas.json')
const music = require('./music.js')
const googleSearch = require('./googleSearch.js')



let banList = []

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


//event that is ran when a new message is received
client.on('message', async message => 
{
    prefix = await admin.getPrefix(message)
    admin.linkManagement(message, banList, client)

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


    if(message.content.includes("printprefix"))
    {
        message.channel.send(`The current prefix is ${prefix}`)
    }

    if(message.content.includes("resetprefix"))
    {
        reset = "prefix -"
        admin.setPrefix(message, reset)
    }
    

    //check if message starts with the command prefix
    if(message.content.trim().startsWith(prefix, 0)) 
    {
        message.content = message.content.substr(prefix.length, message.content.length).trim().toLowerCase()
        command = message.content

        //separates the command from the rest of the string using space as a separator
        if(command.includes(" ")) 
        {
            command = command.substr(0, content.indexOf(" ")).trim()
        }

        console.log(command)
        //switch statement to determine what command the user used
        switch(command) 
        {
            case "daily":
                economy.daily(message)
                break
            case "balance":
                economy.messageCurrentBalance(message)
                break
            case "coinflip":
                message.content = message.content.substr(8, message.content.length).trim()
                economy.coinflip(message)
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
                if(message.content === "play")
                    music.resume(message)
                else
                    music.execute(message, content)
                break
            case "p":
                if(message.content === "p")
                    music.resume(message)
                else
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
            case "restart":
                music.restart(message)
                break
            case "queue":
                music.queue(message)
                break
            case "skipto":
                music.skipTo(message)
                break
            case "ytsr":
                music.ytSearch(message)
            case "banword":
                if(message.member.hasPermission("ADMINISTRATOR"))
                {
                    content = content.substr(7, content.length).trim()
                    banList.push(content)
                    message.channel.send(`The string "${content}" has been banned`)
                }

                else
                {
                    message.channel.send("You need admin privileges to ban words")
                }
                break
            case "unbanword":
                if(message.member.hasPermission("ADMINISTRATOR"))
                {
                    content = content.substr(9, content.length).trim()
                    if(banList.indexOf(content) != -1)
                    {
                        banList = banList.splice(banList.indexOf(content), 1)
                    }

                    else
                    {
                        message.channel.send("That word is not banned!")
                    }
                }

                else
                {
                    message.channel.send("You need admin privileges to unban words")
                }
                break
            case "showbanlist":
                results = ""
                if(banList)
                {
                    for(i of banList)
                    {
                        results += i + "\n"
                    }

                    message.channel.send(results)
                }

                else
                {
                    message.channel.send("The banlist is empty")
                }
                break
            case "getinvite":
                message.channel.createInvite().then(invite => message.channel.send(invite.url))
                .catch(console.error)
                break
            case "ytsearch":
                music.ytSearch(message, content)
                break
                        
        }
    }
})
client.login(config.token)
