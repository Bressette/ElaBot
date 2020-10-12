module.exports = 
{
    name: "kick",
    description: "Kicks the provided user from the server",
    aliases: [],
    execute(message, args)
    {
        if(message.mentions.members.first() != null)
        {
            if(message.member.hasPermission("ADMINISTRATOR"))
            {
                member = message.mentions.members.first()
                member.kick().then((member) =>
                {
                    message.channel.send(":wave: " + member.displayName + " has been kicked from the server :sunglasses: ")
                }).catch(() =>
                {
                    console.log("Error")
                })
            }
            else
            {
                message.channel.send("You do not have the permission to do that :rage:")
            }
        }

        else
        {
            message.channel.send("That user does not exist")
        }
    }
}