import {MongoUtil} from "./mongoUtil.js";

export class GetLoop
{
    static commandName = "getloop";
    static description = "Returns if the music is looping in the given guild";
    static async execute(guild)
    {
        const dbo = MongoUtil.getDb()
        let result = await dbo.collection("servers").findOne({id: guild.id})
        if(result.loop === undefined)
        {
            dbo.collection("servers").updateOne({id: guild.id}, {$set: {loop:false}})
        }
        return result.loop
    }
}
