module.exports =
    {
        name: "mute",
        description: "Mutes the given user",
        aliases: [],
        execute: function (message, args) {
            if (message.mentions.members.first() != null) {
                if (message.member.permissions.has("ADMINISTRATOR")) {
                    var member = message.mentions.members.first();
                    member.voice.setMute(true, "Muted").then(message.channel.send(member.displayName + " has been muted"));
                }
            }
        }
    };
