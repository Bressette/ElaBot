module.exports =
{
    name: "pause",
    description: "Pauses the audio being played by the bot",
    aliases: ['stop'],
    execute(message, args)
    {
        try
          {
            serverQueue = message.client.queue.get(message.guild.id)
            serverQueue.audioPlayer.pause();
            message.channel.send("The audio has been paused.")
          } catch(err)
          {
              message.channel.send(err)
          }
    }
}
