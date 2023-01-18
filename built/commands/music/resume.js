module.exports =
    {
        name: "resume",
        description: "Resumes music playing if it is paused",
        aliases: ['unpause'],
        execute: function (message, args) {
            try {
                var serverQueue = message.client.queue.get(message.guild.id);
                serverQueue.audioPlayer.resume();
            }
            catch (err) {
                message.channel.send(err);
            }
        }
    };
//# sourceMappingURL=resume.js.map