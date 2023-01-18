module.exports =
    {
        name: "skip",
        description: "Skips the current song that is playing",
        aliases: [],
        execute: function (message, args) {
            var serverQueue = message.client.queue.get(message.guild.id);
            if (!message.member.voice.channel)
                return message.channel.send("You have to be in a voice channel to stop the music!");
            if (!serverQueue)
                return message.channel.send("There is no song that I could skip!");
            serverQueue.audioPlayer.stop();
        }
    };
