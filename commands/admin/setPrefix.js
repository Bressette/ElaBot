const mongoUtil = require('../../util/mongoUtil')

module.exports = {
    name: "setPrefix",
    description: "sets the prefix used to give the bots commands ex: -prefix !(Sets the new prefix to !)",
    execute(message, args)
    {
        dbo = mongoUtil.getDb()
        var ascii = /^[ -~]+$/;
        if(!ascii.test(message.content))
        {
            message.channel.send("That prefix is not allowed")
        }
        else
        {
            dbo.collection("servers").updateOne({id: message.guild.id}, {$set: {prefix: message.content}}, (err, res) =>
            {
                if(err) throw err

                message.channel.send(`The command prefix has been changed to ${message.content}`)
            })
        }
    }
}