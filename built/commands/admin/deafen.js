module.exports =
    {
        name: "deafen",
        description: "Deafens the given user",
        aliases: [],
        execute: function (message, args) {
            if (message.mentions.members.first() != null) {
                if (message.member.permissions.has("ADMINISTRATOR")) {
                    var member = message.mentions.members.first();
                    member.voice.setDeaf(true, "Deafened").then(message.channel.send(member.displayName + " has been deafened"));
                }
            }
        }
    };
