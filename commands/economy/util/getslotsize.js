const mongoUtil = require('./../../../util/mongoUtil')

module.exports = 
{
    async execute(message)
    {
        dbo = mongoUtil.getDb()
        result = await dbo.collection("servers").findOne({id: message.guild.id})

        if(result.slotsize === undefined || result.slotsize === null)
        {
            dbo.collection("servers").updateOne({id: message.guild.id}, {$set: {slotsize: "3"}}, (err, value) =>
            {
                if(err) throw err

                return 3
            })
        }

        else
        {
            return parseInt(result.slotsize)
        }
    }
}