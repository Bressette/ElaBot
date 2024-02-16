import {Play as play} from "./play.js";

export class Restart {
    static commandName = "restart";
    static description = "Restarts the current playing song";
    static aliases = [];

    static execute(message, args) {
        try {
            const serverQueue = message.client.queue.get(message.guild.id);
            play.execute(message, serverQueue.songs[0].url).then(() => {
                serverQueue.audioPlayer.stop();
            });
        } catch (err) {
            console.log("Encountered error restarting the current song: " + JSON.stringify(err));
            message.channel.send("Could not restart the current song");
        }
    }
}
