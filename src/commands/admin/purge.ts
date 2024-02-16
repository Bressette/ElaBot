export class Purge
{
    static commandName = "purge";
    static description = "Deletes a given number of messages from the channel the command is invoked in";
    static aliases = [];
    static async execute(message, args)
    {

        if(message.member.permissions.has("ADMINISTRATOR"))
        {
            
            let deleteCount = parseInt(args[0])
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