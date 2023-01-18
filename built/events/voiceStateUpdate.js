module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    execute: function (oldState, newState, client) {
        var _a;
        if (newState.channel === null && newState.member.id === "703427817009840188") {
            client.queue.delete(oldState.guild.id);
        }
        var serverQueue;
        if (oldState.channel)
            serverQueue = oldState.channel.client.queue.get(oldState.channel.guild.id);
        if (serverQueue) {
            if (serverQueue.voiceChannel.members.size === 1 && serverQueue.voiceChannel.members.first().id === "703427817009840188") {
                serverQueue = serverQueue.voiceChannel.client.queue.get(serverQueue.voiceChannel.guild.id);
                serverQueue.songs = [];
                (_a = serverQueue.connection) === null || _a === void 0 ? void 0 : _a.destroy();
            }
        }
    }
};
//# sourceMappingURL=voiceStateUpdate.js.map