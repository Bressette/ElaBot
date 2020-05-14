

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
    }
}