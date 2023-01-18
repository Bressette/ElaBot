module.exports = 
{
    name: "resume",
    description: "Resumes music playing if it is paused",
    aliases: ['unpause'],
    execute(message, args)
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
