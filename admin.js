const mongoUtil = require('./mongoUtil.js')
const config = require('./config.json')

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

        generalLinksId = config.generallinks
        videoLinksId = config.videolinks
        steamLinksId = config.steamlinks
        twitterLinksId = config.twitterlinks
        amazonLinksId = config.amazonlinks
        imagesId = config.images
        gifsId = config.gifs

        generalLinks = await client.channels.fetch(config.generallinks)
        videoLinks = await client.channels.fetch(config.videolinks)
        steamLinks = await client.channels.fetch(config.steamlinks)
        twitterLinks = await client.channels.fetch(config.twitterlinks)
        amazonLinks = await client.channels.fetch(config.amazonlinks)
        images = await client.channels.fetch(config.images)
        gifs = await client.channels.fetch(config.gifs)


        
        
        if(!message.author.bot && message.guild.id === "502575389550575636")
        {
            if(message.content.includes("https://www.youtube.com") || (message.content.includes("https://twitter.com") && message.content.includes("?s=")))
            {
                videoLinks.send(message.content)
                if(message.content.includes("https://twitter.com"))
                    twitterLinks.send(message.content)
            }

            else if(message.content.includes("https://store.steampowered.com"))
                steamLinks.send(message.content)
            
            else if(message.content.includes("https://www.amazon.com"))
                amazonLinks.send(message.content)

            else if(message.attachments.size > 0)
                images.send(message.content)
            
            else if(message.content.includes("https://tenor.com"))
                gifs.send(message.content)
            
            else if(module.exports.isUrl(message.content))
                generalLinks.send(message.content)
        }

        



        if(message.channel.id === config.linkid)
        {
            
            try
            {
            if(!module.exports.isUrl(message.content))
            {
                if(message.author.bot)
                {
                    setTimeout(() =>
                    {
                            message.delete().catch((error) => {
                            console.log(`Error at bot delete ${error}`)
                        })
                    }, 3000)
                    return
                }
                
                setTimeout(() =>
                {
                    message.channel.send("That isn't a link")
                    message.delete().catch((error) => {
                        console.log(`Error at normal delete ${error}`)
                    })
                }, 3000)
            }

            } catch(err)
            {
                console.log(err)
            }
        }


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