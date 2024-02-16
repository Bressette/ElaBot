export class Resume
{
    static commandName = "resume";
    static description = "Resumes music playing if it is paused";
    static aliases = ['unpause'];
    static execute(message, args)
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
