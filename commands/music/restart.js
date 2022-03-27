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
              const serverQueue = message.client.queue.get(message.guild.id)
              play.execute(message, serverQueue.songs[0].url).then(() =>
              {
                  serverQueue.audioPlayer.stop();
              })
          } catch(err)
          {
              console.log("Encountered error restarting the current song: " + JSON.stringify(err));
              message.channel.send("Could not restart the current song");
          }
    }
}
