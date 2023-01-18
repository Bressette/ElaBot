module.exports =
    {
        name: "skipto",
        description: "Skips to the song in the specified queue position",
        aliases: [],
        execute: function (message, args) {
            var serverQueue = message.client.queue.get(message.guild.id);
            var position = parseInt(args[0]);
            if (!isNaN(position) && isFinite(position) && position <= serverQueue.songs.length + 1 && position > 0) {
                for (var i = 0; i < position - 2; i++) {
                    serverQueue.songs.shift();
                }
                serverQueue.audioPlayer.stop();
            }
            else {
                message.channel.send("Enter a valid number to skip to");
            }
        }
    };
//# sourceMappingURL=skipto.js.map