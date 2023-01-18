module.exports =
    {
        name: "kick",
        description: "Kicks the provided user from the server",
        aliases: [],
        execute: function (message, args) {
            if (message.mentions.members.first() != null) {
                if (message.member.permissions.has("ADMINISTRATOR")) {
                    var member = message.mentions.members.first();
                    console.log(message.member.id);
                    member.kick().then(function (member) {
                        message.channel.send(":wave: " + member.displayName + " has been kicked from the server :sunglasses: ");
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
