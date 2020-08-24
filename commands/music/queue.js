module.exports = 
{
    name: "queue",
    description: "Prints the current queue",
    aliases: [],
    execute(message, args)
    {
        serverQueue = message.client.queue.get(message.guild.id)
        if(!serverQueue)
            message.channel.send("The queue is empty")
        else
        {
            temp = "**Queue**\n"
            for(i in serverQueue.songs)
            {
                position = parseInt(i) + parseInt(1)
                temp += "**" + position + "** " + serverQueue.songs[i].title + "\n"
            }
            message.channel.send(temp)
        }
    }
}