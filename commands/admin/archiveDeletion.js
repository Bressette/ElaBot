const config = require('./../../config.json')

module.exports = 
{
    name: "archiveDeletion",
    description: "Deletes messages from normal users in archive channels",
    execute(message)
    {
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
    }
}