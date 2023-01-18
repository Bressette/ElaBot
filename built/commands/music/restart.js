var play = require('./play');
module.exports =
    {
        name: "restart",
        description: "Restarts the current playing song",
        aliases: [],
        execute: function (message, args) {
            try {
                var serverQueue_1 = message.client.queue.get(message.guild.id);
                play.execute(message, serverQueue_1.songs[0].url).then(function () {
                    serverQueue_1.audioPlayer.stop();
                });
            }
            catch (err) {
                console.log("Encountered error restarting the current song: " + JSON.stringify(err));
                message.channel.send("Could not restart the current song");
            }
        }
    };
//# sourceMappingURL=restart.js.map