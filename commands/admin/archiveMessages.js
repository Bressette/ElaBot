const isUrl = require('./../../util/isUrl')
const getMention = require('./../../util/getMention')
const config = require('./../../config.json')


module.exports = 
{
    name: "archiveMessages",
    description: "Posts messages into archive channels to collate a filtered history of messages",
    aliases: [],
    async execute(message)
    {
        generalLinks = await message.client.channels.fetch(config.generallinks)
        videoLinks = await message.client.channels.fetch(config.videolinks)
        steamLinks = await message.client.channels.fetch(config.steamlinks)
        twitterLinks = await message.client.channels.fetch(config.twitterlinks)
        amazonLinks = await message.client.channels.fetch(config.amazonlinks)
        images = await message.client.channels.fetch(config.images)
        gifs = await message.client.channels.fetch(config.gifs)
        other = await message.client.channels.fetch(config.other)

        includesLink = false

        for(i = 0; i < message.content.length; i++)
        {
            for(j = i; j < message.content.length; j++)
            {
                tempString = message.content.substring(i, j+1)
                if(isUrl.execute(tempString))
                {
                    includesLink = true
                }
                    
                mention = getMention.execute(tempString)
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
    }
}