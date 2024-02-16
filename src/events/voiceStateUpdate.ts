export class VoiceStateUpdate {
    static commandName = 'voiceStateUpdate';
    static once = false;
    static execute(oldState, newState, client) {
        if(newState.channel === null && newState.member.id === "703427817009840188")
        {
            client.queue.delete(oldState.guild.id)
        }

        let serverQueue
        if(oldState.channel)
            serverQueue = oldState.channel.client.queue.get(oldState.channel.guild.id)
        if(serverQueue)
        {
            if(serverQueue.voiceChannel.members.size === 1 && serverQueue.voiceChannel.members.first().id === "703427817009840188")
            {
                serverQueue = serverQueue.voiceChannel.client.queue.get(serverQueue.voiceChannel.guild.id)
                serverQueue.songs = [];
                serverQueue.connection?.destroy();
            }
        }
    }
}
