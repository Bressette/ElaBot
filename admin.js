const mongoUtil = require('./mongoUtil.js')
const config = require('./config.json')
const util = require('util')
const fs = require('fs')
const readFile = util.promisify(fs.readFile)

module.exports = 
{
    kick : (message) =>
    {
        if(message.mentions.members.first() != null)
        {
            if(message.member.hasPermission("ADMINISTRATOR"))
            {
                member = message.mentions.members.first()
                
                member.kick().then((member) =>
                {
                    message.channel.send(":wave: " + member.displayName + " has been kicked from the server :sunglasses: ")
                }).catch(() =>
                {
                    console.log("Error")
                })
            }
            else
            {
                message.channel.send("You do not have the permission to do that :rage:")
            }
        }

        else
        {
            message.channel.send("That user does not exist")
        }
    },

    ban : (message) =>
    {
        if(message.mentions.members.first() != null)
        {
            if(message.member.hasPermission("ADMINISTRATOR"))
            {
                member = message.mentions.members.first()
                
                member.ban().then((member) =>
                {
                    message.channel.send(":wave: " + member.displayName + " has been banned from the server :sunglasses: ")
                }).catch(() =>
                {
                    console.log("Error")
                })
            }
            else
            {
                message.channel.send("You do not have the permission to do that :rage:")
            }
        }

        else
        {
            message.channel.send("That user does not exist")
        }
    },

    mute : (message) =>
    {
        if(message.mentions.members.first() != null)
        {
            if(message.member.hasPermission("ADMINISTRATOR"))
            {
                member = message.mentions.members.first()

                member.voice.setMute(true, "Muted").then(message.channel.send(member.displayName + " has been muted"))
            }
        }
    },

    unMute : (message) =>
    {
        if(message.mentions.members.first() != null)
        {
            if(message.member.hasPermission("ADMINISTRATOR"))
            {
                member = message.mentions.members.first()

                member.voice.setMute(false, "Unmuted").then(message.channel.send(member.displayName + " has been unmuted"))
            }
        }
    },

    deafen : (message) =>
    {
        if(message.mentions.members.first() != null)
        {
            if(message.member.hasPermission("ADMINISTRATOR"))
            {
                member = message.mentions.members.first()

                member.voice.setDeaf(true, "Deafened").then(message.channel.send(member.displayName + " has been deafened"))
            }
        }
    },

    unDeafen : (message) =>
    {
        if(message.mentions.members.first() != null)
        {
            if(message.member.hasPermission("ADMINISTRATOR"))
            {
                member = message.mentions.members.first()

                member.voice.setDeaf(false, "UnDeafened").then(message.channel.send(member.displayName + " has been undeafened"))
            }
        }
    },


    purge : async (message, content) =>
    {
        if(message.member.hasPermission("ADMINISTRATOR"))
        {
            content = content.substr(5, content.length)
            deleteCount = parseInt(content)
            if(!isNaN(deleteCount))
            {
                if(deleteCount + 1 > 99 || deleteCount + 1 < 2)
                    message.channel.send("The amount of purged messages should be between 1-98")
                else
                {
                    const fetched = await message.channel.messages.fetch(
                    {
                        limit: ++deleteCount
                    })
                
                    message.channel.bulkDelete(fetched).catch(error => message.reply("Couldn't delete messages because of: ${error}"))
                }
            }
        }

        else
        {
            message.channel.send("You do not have the permission to do that :rage:")
        }
    },

    //method that deletes any messages that are not a link in the channel defined in the config file
    linkManagement: async (message, banList, client) =>
    {
        if(!message.author.bot && !message.content.includes("unbanword"))
        {
            if(banList)
            {
                for(i of banList)
                {
                    if(message.content.toLowerCase().includes(i))
                    {
                        message.delete()
                        return
                    }
                }
            }
        }

        module.exports.archiveMessages(message, client)

        if(!message.author.bot)
        {
            if(message.channel.id === config.generallinks || message.channel.id == config.videolinks
                || message.channel.id === config.steamlinks || message.channel.id === config.twitterlinks
                || message.channel.id === config.amazonlinks || message.channel.id === config.images
                || message.channel.id === config.gifs || message.channel.id === config.other)
            {
                message.delete().catch((error) =>
                {
                    console.log(`Error deleting from the archives ${error}`)
                })
            }
        }


    },

    getMention: (content) =>
    {
        if(content.startsWith("<@") && content.endsWith(">"))
        {
            return content
        }

        else
        {
            return null
        }
    },

    archiveMessages: async(message, client) =>
    {

        generalLinks = await client.channels.fetch(config.generallinks)
        videoLinks = await client.channels.fetch(config.videolinks)
        steamLinks = await client.channels.fetch(config.steamlinks)
        twitterLinks = await client.channels.fetch(config.twitterlinks)
        amazonLinks = await client.channels.fetch(config.amazonlinks)
        images = await client.channels.fetch(config.images)
        gifs = await client.channels.fetch(config.gifs)
        other = await client.channels.fetch(config.other)

        includesLink = false

        for(i = 0; i < message.content.length; i++)
        {
            for(j = i; j < message.content.length; j++)
            {
                tempString = message.content.substring(i, j+1)
                if(module.exports.isUrl(tempString))
                {
                    includesLink = true
                }
                    
                mention = module.exports.getMention(tempString)
                if(mention)
                {
                    message.content = message.content.replace(mention, "")
                }
            }
        }
        

        if(!message.author.bot && message.guild.id === "502575389550575636")
        {
            if(message.content.includes("https://www.youtube.com") || (message.content.includes("https://twitter.com") && message.content.includes("?s="))
               || message.content.includes("https://youtu.be"))
            {
                videoLinks.send(`${message.author.tag} on ${message.createdAt.toDateString()} - ${message.content}`)
                if(message.content.includes("https://twitter.com"))
                    twitterLinks.send(`${message.author.tag} on ${message.createdAt.toDateString()} - ${message.content}`)
            }
            else if(message.content.includes("https://twitter.com"))
            {
                twitterLinks.send(`${message.author.tag} on ${message.createdAt.toDateString()} - ${message.content}`)
            }
                
            else if(message.content.includes("https://store.steampowered.com"))
            {
                steamLinks.send(`${message.author.tag} on ${message.createdAt.toDateString()} - ${message.content}`)
            }
                
            else if(message.content.includes("https://www.amazon.com"))
            {
                amazonLinks.send(`${message.author.tag} on ${message.createdAt.toDateString()} - ${message.content}`)
            }
                
            else if(message.content.includes("https://tenor.com"))
            {
                gifs.send(`${message.author.tag} on ${message.createdAt.toDateString()} - ${message.content}`)
            }

            else if(message.attachments.size > 0)
            {
                picture = message.attachments.array()
                images.send(`${message.author.tag} on ${message.createdAt.toDateString()} - ${message.content} ${picture[0].url}`)
            }
                
            else if(includesLink)
            {
                try
                {
                    await generalLinks.send(`${message.author.tag} on ${message.createdAt.toDateString()} | ${message.content}`)
                } catch(error)
                {
                    console.log(error)
                }
                
                
            }
                
            else
            {
                other.send(`${message.author.tag} on ${message.createdAt.toDateString()} - ${message.content}`)
            }
        }

    },

    messageUrlCheck: (content) =>
    {
        status = false

        for(i = 0; i < content.length; i++)
        {
            for(j = i; j < content.length; j++)
            {
                tempString = content.substring(i, j+1)
                if(module.exports.isUrl(tempString))
                {
                    return true
                }
            }
        }

        return status
    },

    importLinks: async (client) =>
    {

        general = await client.channels.fetch("610639803662336021")
        maymays = await client.channels.fetch("507998836233338882")
        videos = await client.channels.fetch("507998917846106162")
        linksherenerds = await client.channels.fetch("518655793961369602")
        brucemad = await client.channels.fetch("559017797057773580")
        dcbadhaha = await client.channels.fetch("574067019381735435")
        rankedflex = await client.channels.fetch("589595674971209729")
        art = await client.channels.fetch("611679566938898626")
        minecraft = await client.channels.fetch("629133817101287443")
        epicbot = await client.channels.fetch("635974542468186142")
        spaceengineers = await client.channels.fetch("638374818059649024")
        lmaobryceislame = await client.channels.fetch("653714617268174848")
        vr = await client.channels.fetch("662437212633169950")
        bots = await client.channels.fetch("715776883945504769")

        allMessages = []
        messages = await module.exports.getMessages(general, 1000000)
        allMessages = module.exports.pushMessages(messages, allMessages)
        messages = await module.exports.getMessages(maymays, 1000000)
        allMessages = module.exports.pushMessages(messages, allMessages)
        messages = await module.exports.getMessages(videos, 1000000)
        allMessages = module.exports.pushMessages(messages, allMessages)
        messages = await module.exports.getMessages(linksherenerds, 1000000)
        allMessages = module.exports.pushMessages(messages, allMessages)
        messages = await module.exports.getMessages(brucemad, 1000000)
        allMessages = module.exports.pushMessages(messages, allMessages)
        messages = await module.exports.getMessages(dcbadhaha, 1000000)
        allMessages = module.exports.pushMessages(messages, allMessages)
        messages = await module.exports.getMessages(rankedflex, 1000000)
        allMessages = module.exports.pushMessages(messages, allMessages)
        messages = await module.exports.getMessages(art, 1000000)
        allMessages = module.exports.pushMessages(messages, allMessages)
        messages = await module.exports.getMessages(minecraft, 1000000)
        allMessages = module.exports.pushMessages(messages, allMessages)
        messages = await module.exports.getMessages(epicbot, 1000000)
        allMessages = module.exports.pushMessages(messages, allMessages)
        messages = await module.exports.getMessages(spaceengineers, 1000000)
        allMessages = module.exports.pushMessages(messages, allMessages)
        messages = await module.exports.getMessages(lmaobryceislame, 1000000)
        allMessages = module.exports.pushMessages(messages, allMessages)
        messages = await module.exports.getMessages(vr, 1000000)
        allMessages = module.exports.pushMessages(messages, allMessages)
        messages = await module.exports.getMessages(bots, 1000000)
        allMessages = module.exports.pushMessages(messages, allMessages)

        allMessages.sort(function(a, b) 
        {
            return new Date(a.createdAt) - new Date(b.createdAt)
        })
        console.log("After getting messages")

        

        for(i of allMessages)
        {
           try
           {
                await module.exports.archiveMessages(i, client)
           } catch(error) {
               console.log(error)
           }
           
        }

    
    },

    pushMessages: (messages, destination) =>
    {
        for(i of messages)
        {
            destination.push(i)
        }

        return destination
    },


    getMessages: async (channel, limit) => 
    {
        const sum_messages = [];
        let last_id;
        console.log("in getMessages")
    
        while (true) 
        {
            const options = { limit: 100 };
            if (last_id) 
            {
                options.before = last_id;
            }
    
            const messages = await channel.messages.fetch(options);
            sum_messages.push(...messages.array());
            last_id = messages.last().id;
    
            if (messages.size != 100 || sum_messages >= limit) 
            {
                break;
            }
        }
    
        return sum_messages;
    },

    isUrl: (linkString) => 
    {
        var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
        var url = new RegExp(urlRegex, 'i');

        return url.test(linkString)
    },

    getPrefix: async (message) =>
    {
        dbo = mongoUtil.getDb()
        result = await dbo.collection("servers").findOne({id: message.guild.id})
        if(result === null || result === undefined)
        {
            dbo.collection("servers").insertOne({id: message.guild.id, prefix: "-", loop: false}, (err, res) =>
            {
                if(err) throw err
                return "-"
            })
        }

        // dbo.collection("users").updateOne({ name: userId}, { $set: {date: date}}, function(err, res)

        else if(result.prefix === null || result.prefix === undefined)
        {
            dbo.collection("servers").updateOne({id: message.guild.id}, { $set: {prefix: "-"}}, (err, res) =>
            {
                if(err) throw err
                return "-"
            })
        }

        else
            return result.prefix
    },

    setPrefix: (message, content) =>
    {
        dbo = mongoUtil.getDb()
        var ascii = /^[ -~]+$/;
        if(!ascii.test(content.substr(6,content.length).trim()))
        {
            message.channel.send("That prefix is not allowed")
        }
        else
        {
            dbo.collection("servers").updateOne({id: message.guild.id}, {$set: {prefix: content.substr(6, content.length).trim()}}, (err, res) =>
            {
                if(err) throw err

                message.channel.send(`The command prefix has been changed to ${content.substr(6, content.length).trim()}`)
            })
        }
    }
}