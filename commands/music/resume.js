module.exports = 
{
    name: "resume",
    description: "Resumes music playing if it is paused",
    aliases: [],
    execute(message, args)
    {
        try
          {
            serverQueue = message.client.queue.get(message.guild.id)
            serverQueue.connection.dispatcher.resume()
          } catch(err)
          {
              message.channel.send(err)
          }
    }
}