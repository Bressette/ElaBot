export class Deafen {
    static commandName = "deafen";
    static description = "Deafens the given user";
    static aliases = [];
    static execute(message, args)
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