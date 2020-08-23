module.exports = 
{
    name: "stop",
    description: "Forces the bot to leave the voice channel and remove the music queue",
    aliases: ['reset', 'r'],
    execute(message, args)
    {
        serverQueue = message.client.queue.get(message.guild.id)

        if(serverQueue.connection.dispatcher.paused)
            serverQueue.connection.dispatcher.resume()
        if (!message.member.voice.channel)
          return message.channel.send(
            "You have to be in a voice channel to stop the music!"
          );
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }
}