export class Skipto
{
    static commandName = "skipto";
    static description = "Skips to the song in the specified queue position";
    static aliases = [];
    static execute(message, args)
    {
        const serverQueue = message.client.queue.get(message.guild.id)
        const position = parseInt(args[0])
        if(!isNaN(position) && isFinite(position) && position <= serverQueue.songs.length + 1 && position > 0)
        {
            for(let i = 0; i < position - 2; i++)
            {
                serverQueue.songs.shift()
            }

            serverQueue.audioPlayer.stop()
        }
        else
        {
            message.channel.send("Enter a valid number to skip to")
        }
    }
}
