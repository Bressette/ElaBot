export class Pause
{
    public static commandName = "pause";
    public static description = "Pauses the audio being played by the bot";
    public static aliases = ['stop'];
    public static execute(message, args)
    {
        try
          {
            const serverQueue = message.client.queue.get(message.guild.id);
            serverQueue.audioPlayer.pause();
            message.channel.send("The audio has been paused.");
          } catch(err)
          {
              message.channel.send(err);
          }
    }
}
