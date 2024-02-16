export class Mute
{
    static commandName = "mute";
    static description = "Mutes the given user";
    static aliases = [];
    static execute(message, args)
    {
        if(message.mentions.members.first() != null)
        {
            if(message.member.permissions.has("ADMINISTRATOR"))
            {
                let member = message.mentions.members.first()

                member.voice.setMute(true, "Muted").then(message.channel.send(member.displayName + " has been muted"))
            }
        }
    }
}