export class Ban
{
    public static commandName = "ban";
    public static description = "Bans the provided user";
    public static aliases = [];
    public static execute(message, args)
    {
        if(message.mentions.members.first() != null)
        {
            if(message.member.permissions.has("ADMINISTRATOR"))
            {
                let member = message.mentions.members.first()
                
                member.ban().then((member) =>
                {
                    message.channel.send(":wave: " + member.displayName + " has been banned from the server :sunglasses: ")
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