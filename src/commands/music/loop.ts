import {MongoUtil} from "../../util/mongoUtil.js";
import {Utils} from "../../util/Utils.js";

export class Loop
{
    public static commandName = "loop";
    public static description = "Enables looping for the currently playing song";
    public static aliases = [];
    public static async execute(message, args)
    {
        const dbo = MongoUtil.getDb()
        const loop = await Utils.getLoop(message.guild)
        if(!loop)
        {
            dbo.collection("servers").updateOne({id: message.guild.id}, {$set:{"loop":true}})
            message.channel.send("Loop is enabled")
        }
        else
        {
            dbo.collection("servers").updateOne({id: message.guild.id}, {$set: {"loop":false}})
            message.channel.send("Loop is disabled")
        }
    }
}
