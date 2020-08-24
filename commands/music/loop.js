const db = require('./../../util/mongoUtil')
const getLoop = require('./../../util/getLoop')

module.exports = 
{
    name: "loop",
    description: "Enables looping for the currently playing song",
    aliases: [],
    async execute(message, args)
    {
          dbo = db.getDb()
          loop = await getLoop.execute(message.guild)
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