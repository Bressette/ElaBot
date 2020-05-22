const discord = require('discord.js')
const client = new discord.Client
const mongoUtil = require('./mongoUtil.js')
const economy = require('./economy')
const admin = require('./admin')
const config = require('./config.json')
const copyPastas = require('./copy-pastas.json')
const music = require('./music.js')
const search = require('youtube-search')

prefix = "-"

var opts = 
{
    maxResults: 10,
    key: config.googlekey
}

mongoUtil.connectToServer(() =>
{
})

slotSize = 5

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
    if(message.author.id != 712443987801145355)
    {
        if(message.author.bot)
        return
    }

    else
    {
        message.react("713172523424153610")
    }
    
    userTag = message.member.user.tag
    userId = message.member.user.id
    content = message.content

    if(message.channel.id === config.linkid)
    {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i');
        if(!pattern.test(message.content))
        {
            message.channel.send("That isn't a link!").then(msg =>
            {
                setTimeout(() =>
                {
                    message.delete()
                    msg.delete()
                }, 2000)
            }).catch((error) => {message.channel.send(error)})
        }
    }

    if(message.content.includes("printprefix"))
    {
        message.channel.send(`The current prefix is ${prefix}`)
    }
    

    //check if content starts with the command prefix e!
    if(content.trim().startsWith("e!", 0) || content.trim().startsWith(prefix,0) || content.trim().startsWith("%", 0)) 
    {
        if(content.trim().startsWith("e!", 0))
            content = content.substr(2, content.length).trim()
        else if(content.trim().startsWith(prefix,0))
            content = content.substr(prefix.length, content.length).trim()
        else
            content = content.substr(1, content.length).trim()

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
                searchKeywords = content.substr(4, content.length).trim()

                if(!searchKeywords.includes("http"))
                {
                  search(searchKeywords, opts, function(err, results) 
                  {
                      if(err) return console.log("This is an error\n" + err)
                      i = 0
                      while(results[i].link.includes("channel") || results[i].link.includes("list="))
                      {
                          i++
                      }

                      // execute(message, results[0].link, serverQueue)
                      music.execute(message, results[i].link)

                  })
                }

                else
                  // execute(message, searchKeywords, serverQueue)
                  music.execute(message, searchKeywords)
                break
            case "p":
                searchKeywords = content.substr(1, content.length).trim()

                if(!searchKeywords.includes("http"))
                {
                  search(searchKeywords, opts, function(err, results) 
                  {
                      if(err) return console.log("This is an error\n" + err)
                      i = 0
                      while(results[i].link.includes("channel") || results[i].link.includes("list="))
                      {
                          i++
                      }
                      music.execute(message, resuts[i].link)
                  })
                }

                else
                    music.execute(message, results[i].link)
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
            case "prefix":
                var ascii = /^[ -~]+$/;
                if(!ascii.test(content.substr(6,content.length).trim()))
                {
                    message.channel.send("That prefix is not allowed")
                }
                else
                {
                    prefix = content.substr(6, content.length).trim()
                    message.channel.send(`The command prefix has been changed to ${prefix}`)
                }
                break
            case "link":
                message.channel.send("The bot authorization link is: https://discord.com/api/oauth2/authorize?client_id=703427817009840188&permissions=8&scope=bot")
                break
        }
    }
})

client.login(config.token)
