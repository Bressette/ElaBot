module.exports =
    {
        name: "queue",
        description: "Prints the current queue",
        aliases: [],
        execute: function (message, args) {
            var serverQueue = message.client.queue.get(message.guild.id);
            if (!serverQueue)
                message.channel.send("The queue is empty");
            else {
                var temp = "**Queue**\n";
                for (var i in serverQueue.songs) {
                    var position = parseInt(i) + 1;
                    temp += "**" + position + "** " + serverQueue.songs[i].title + "\n";
                }
                message.channel.send(temp);
            }
        }
    };
//# sourceMappingURL=queue.js.map