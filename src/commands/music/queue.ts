export class Queue
{
    public static commandName = "queue";
    public static description = "Prints the current queue";
    public static aliases = [];
    public static execute(message, args)
    {
        const serverQueue = message.client.queue.get(message.guild.id)
        if(!serverQueue)
            message.channel.send("The queue is empty")
        else
        {
            let temp = "**Queue**\n"
            for(const i in serverQueue.songs)
            {
                const position = parseInt(i) + 1
                temp += "**" + position + "** " + serverQueue.songs[i].title + "\n"
            }
            message.channel.send(temp)
        }
    }
}
