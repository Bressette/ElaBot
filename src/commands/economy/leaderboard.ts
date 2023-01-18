import {MongoUtil} from "../../util/mongoUtil";

module.exports = 
{
    name: "leaderboard",
    description: "Shows the leaderboard of richest users",
    aliases: [],
    async execute(message, args)
    {
        let dbo = MongoUtil.getDb()
        let cursor = dbo.collection("users").find({}).sort([['amount', -1]])
        let results = await cursor.toArray()

        let leaderBoardString = "```"

        for(let i in results)
        {
            let user = await message.client.users.fetch(results[i].name)
            let userName = user.tag.split("#")[0]
            leaderBoardString += userName + " " + results[i].amount + "\n"
        }

        leaderBoardString += "```"

        message.channel.send(leaderBoardString)
    }
}