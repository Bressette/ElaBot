export class Resume
{
    public static commandName = "resume";
    public static description = "Resumes music playing if it is paused";
    public static aliases = [];
    public static execute(message, args)
    {
        try
          {
              const serverQueue = message.client.queue.get(message.guild.id);
              serverQueue.audioPlayer.resume();
          } catch(err)
          {
              message.channel.send(err);
          }
    }
}
