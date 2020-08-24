module.exports = 
{
    name: "skipto",
    description: "Skips to the song in the specified queue position",
    aliases: [],
    execute(message, args)
    {
        serverQueue = message.client.queue.get(message.guild.id)
        position = parseInt(args[0])
        if(!isNaN(position) && isFinite(position) && position <= serverQueue.songs.length + 1 && position > 0)
        {
            for(i = 0; i < position - 2; i++)
            {
                serverQueue.songs.shift()
            }

            serverQueue.connection.dispatcher.end()
        }

        else
        {
            message.channel.send("Enter a valid number to skip to")
        }
    }
}