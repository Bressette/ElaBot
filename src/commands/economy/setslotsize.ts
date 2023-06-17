import {MongoUtil} from "../../util/mongoUtil";

export class Setslotsize
{
    public static commandName = "setslotsize";
    public static description = "Sets the number of rows and columns when playing slots";
    public static aliases = [];
    public static async execute(message, args)
    {
        let dbo = MongoUtil.getDb()
        let newSize = parseInt(args[0])
        if(!isNaN(newSize))
        {
            if(newSize < 3 || newSize > 12)
                message.channel.send("The slot size must be from 3-12")
            else
            {
                dbo.collection("servers").updateOne({id: message.guild.id}, {$set: {slotsize: newSize}}, (err, value) =>
                {
                    message.channel.send("The new slot size is: " + newSize)
                })
            }   
        }
        else
        {
            message.channel.send("You must enter a valid number for slot size")
        }
    }
}
