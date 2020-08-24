const play = require('./play')

module.exports = 
{
    name: "restart",
    description: "Restarts the current playing song",
    aliases: [],
    execute(message, args)
    {
        try
          {
              serverQueue = message.client.queue.get(message.guild.id)
              play.execute(message, serverQueue.songs[0].url).then(() =>
              {
                  serverQueue.connection.dispatcher.end()
              })
          } catch(err)
          {
              message.channel.send(err)
          }
    }
}