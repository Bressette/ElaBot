import {MongoUtil} from "./mongoUtil.js";

export class GetPrefix
{
    static commandName = 'getPrefix';
    static description = 'Returns the current prefix for the guild that the message is from';
    static async execute(message, args)
    {
        const dbo = MongoUtil.getDb()
        const result = await dbo.collection("servers").findOne({id: message.guild.id})
        if(result === null || result === undefined)
        {
            dbo.collection("servers").insertOne({id: message.guild.id, prefix: "-", loop: false}, (err, res) =>
            {
                if(err) throw err
                return "-"
            })
        }

        // dbo.collection("users").updateOne({ name: userId}, { $set: {date: date}}, function(err, res)

        else if(result.prefix === null || result.prefix === undefined)
        {
            dbo.collection("servers").updateOne({id: message.guild.id}, { $set: {prefix: "-"}}, (err, res) =>
            {
                if(err) throw err
                return "-"
            })
        }

        else
            return result.prefix
    }
}
