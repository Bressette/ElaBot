export class Deafen
{
    public static commandName = "deafen";
    public static description = "Deafens the given user";
    public static aliases = [];
    public static execute(message, args)
    {
        if(message.mentions.members.first() != null)
        {
            if(message.member.permissions.has("ADMINISTRATOR"))
            {
                let member = message.mentions.members.first()

                member.voice.setDeaf(true, "Deafened").then(message.channel.send(member.displayName + " has been deafened"))
            }
        }
    }
}
