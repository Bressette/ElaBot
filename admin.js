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
    linkManagement: (message) =>
    {
        if(message.channel.id === config.linkid)
        {
            
            if(!module.exports.isUrl(message.content))
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

        else
        {
            if(module.exports.isUrl(message.content) && message.channel.id != config.videoid)
            {
                temp = message.author + " Links should be in links-here-nerds!!!"
                message.channel.send(temp)
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