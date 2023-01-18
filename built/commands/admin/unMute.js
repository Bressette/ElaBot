module.exports =
    {
        name: "unMute",
        description: "Unmutes the provided user",
        aliases: [],
        execute: function (message, args) {
            if (message.mentions.members.first() != null) {
                if (message.member.permissions.has("ADMINISTRATOR")) {
                    var member = message.mentions.members.first();
                    member.voice.setMute(false, "Unmuted").then(message.channel.send(member.displayName + " has been unmuted"));
                }
            }
        }
    };
//# sourceMappingURL=unMute.js.map