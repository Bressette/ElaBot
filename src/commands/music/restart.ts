import {Play} from "./play";

export class Restart
{
    public static commandName = "restart";
    public static description = "Restarts the current playing song";
    public static aliases = [];
    public static execute(message, args)
    {
        try
          {
              const serverQueue = message.client.queue.get(message.guild.id);
              Play.execute(message, serverQueue.songs[0].url).then(() =>
              {
                  serverQueue.audioPlayer.stop();
              });
          } catch(err)
          {
              console.log("Encountered error restarting the current song: " + JSON.stringify(err));
              message.channel.send("Could not restart the current song");
          }
    }
}
