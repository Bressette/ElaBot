module.exports = 
{
    name: "reset",
    description: "Forces the bot to leave the voice channel and remove the music queue",
    aliases: ['r', 'leave'],
    execute(message, args)
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
