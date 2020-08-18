module.exports = 
{
    name: "unDeafen",
    description: "Undeafens the specified user",
    async execute(message, args)
    {
        if(message.member.hasPermission("ADMINISTRATOR"))
        {
            
            deleteCount = parseInt(message.content)
            if(!isNaN(deleteCount))
            {
                if(deleteCount + 1 > 99 || deleteCount + 1 < 2)
                    message.channel.send("The amount of purged messages should be between 1-98")
                else
                {
                    const fetched = await message.channel.messages.fetch(
                    {
                        limit: ++deleteCount
                    })
                
                    message.channel.bulkDelete(fetched).catch(error => message.reply("Couldn't delete messages because of: ${error}"))
                }
            }
        }

        else
        {
            message.channel.send("You do not have the permission to do that :rage:")
        }
    }
}