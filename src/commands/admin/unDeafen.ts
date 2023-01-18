module.exports = 
{
    name: "unDeafen",
    description: "Undeafens the specified user",
    aliases: [],
    async execute(message, args)
    {
        if(message.mentions.members.first() != null)
        {
            if(message.member.permissions.has("ADMINISTRATOR"))
            {
                let member = message.mentions.members.first()

                member.voice.setDeaf(false, "UnDeafened").then(message.channel.send(member.displayName + " has been undeafened"))
            }
        }
    }
}