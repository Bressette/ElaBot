module.exports = 
{
    name: "deafen",
    description: "Deafens the given user",
    execute(message, args)
    {
        if(message.mentions.members.first() != null)
        {
            if(message.member.hasPermission("ADMINISTRATOR"))
            {
                member = message.mentions.members.first()

                member.voice.setDeaf(true, "Deafened").then(message.channel.send(member.displayName + " has been deafened"))
            }
        }
    }
}