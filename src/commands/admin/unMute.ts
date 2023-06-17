export class UnMute
{
    public static commandName = "unMute";
    public static description = "Unmutes the provided user";
    public static aliases = [];
    public static execute(message, args)
    {
        if(message.mentions.members.first() != null)
        {
            if(message.member.permissions.has("ADMINISTRATOR"))
            {
                let member = message.mentions.members.first()

                member.voice.setMute(false, "Unmuted").then(message.channel.send(member.displayName + " has been unmuted"))
            }
        }
    }
}
