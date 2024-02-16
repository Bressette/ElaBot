import {MongoUtil} from "../../util/mongoUtil.js";
import {GetLoop as getLoop} from "../../util/getLoop.js";

export class Loop
{
    static commandName = "loop";
    static description = "Enables looping for the currently playing song";
    static aliases = [];
    static async execute(message, args)
    {
        const dbo = MongoUtil.getDb()
        const loop = await getLoop.execute(message.guild)
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
