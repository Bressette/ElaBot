module.exports = 
{
    name: "unDeafen",
    description: "Undeafens the specified user",
    async execute(message, args)
    {
        if(message.mentions.members.first() != null)
        {
            if(message.member.hasPermission("ADMINISTRATOR"))
            {
                member = message.mentions.members.first()

                member.voice.setDeaf(false, "UnDeafened").then(message.channel.send(member.displayName + " has been undeafened"))
            }
        }
    }
}