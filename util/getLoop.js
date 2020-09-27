const db = require('./mongoUtil')

module.exports = 
{
    name: "getloop",
    description: "Returns if the music is looping in the given guild",
    async execute(guild)
    {
        dbo = db.getDb()
          result = await dbo.collection("servers").findOne({id: guild.id})
          if(result.loop === undefined)
          {
              dbo.collection("servers").updateOne({id: guild.id}, {$set: {loop:false}})
          }

          return result.loop
    }
}