const mongoUtil = require('./../../util/mongoUtil')

module.exports = 
{
    name: "leaderboard",
    description: "Shows the leaderboard of richest users",
    aliases: [],
    async execute(message, args)
    {
        dbo = mongoUtil.getDb()
        cursor = dbo.collection("users").find({}).sort([['amount', -1]])
        results = await cursor.toArray()

        leaderBoardString = "```"

        for(i in results)
        {
            user = await message.client.users.fetch(results[i].name)
            userName = user.tag.split("#")[0]
            leaderBoardString += userName + " " + results[i].amount + "\n"
        }

        leaderBoardString += "```"

        message.channel.send(leaderBoardString)
    }
}