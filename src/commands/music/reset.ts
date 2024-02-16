export class Reset
{
    static commandName = "reset";
    static description = "Forces the bot to leave the voice channel and remove the music queue";
    static aliases = ['r', 'leave'];
    static execute(message, args)
    {
        if (!message.member.voice.channel)
        return message.channel.send(
          "You have to be in a voice channel to stop the music!"
        );
        const serverQueue = message.client.queue.get(message.guild.id);
        serverQueue.audioPlayer.stop(true);
        serverQueue.audioPlayer = null;
        serverQueue.songs = [];
    }
}
