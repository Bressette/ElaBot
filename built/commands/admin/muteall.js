module.exports =
    {
        name: "muteall",
        description: "Mutes everyone in the channel",
        aliases: [],
        execute: function (message, args) {
            var voiceChannel = message.member.voice.channel;
            var members = voiceChannel.members.array();
            for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
                var i = members_1[_i];
                i.voice.setMute(true, "Muted");
            }
        }
    };
//# sourceMappingURL=muteall.js.map