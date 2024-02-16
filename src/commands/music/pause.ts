export class Pause
{
    static commandName = "pause";
    static description = "Pauses the audio being played by the bot";
    static aliases = ['stop'];
    static execute(message, args)
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
