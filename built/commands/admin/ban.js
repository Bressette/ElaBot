module.exports =
    {
        name: "ban",
        description: "Bans the provided user",
        aliases: [],
        execute: function (message, args) {
            if (message.mentions.members.first() != null) {
                if (message.member.permissions.has("ADMINISTRATOR")) {
                    var member = message.mentions.members.first();
                    member.ban().then(function (member) {
                        message.channel.send(":wave: " + member.displayName + " has been banned from the server :sunglasses: ");
                    }).catch(function () {
                        console.log("Error");
                    });
                }
                else {
                    message.channel.send("You do not have the permission to do that :rage:");
                }
            }
            else {
                message.channel.send("That user does not exist");
            }
        }
    };
//# sourceMappingURL=ban.js.map