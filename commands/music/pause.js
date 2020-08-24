module.exports =
{
    name: "pause",
    description: "Pauses the audio being played by the bot",
    aliases: [],
    execute(message, args)
    {
        try
          {
            serverQueue = message.client.queue.get(message.guild.id)
            serverQueue.connection.dispatcher.pause()
          } catch(err)
          {
              message.channel.send(err)
          }
    }
}