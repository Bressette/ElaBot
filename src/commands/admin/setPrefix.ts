import {MongoUtil} from "../../util/mongoUtil";

module.exports = {
    name: "setprefix",
    description: "sets the prefix used to give the bots commands ex: -prefix !(Sets the new prefix to !)",
    aliases: [],
    execute(message, args)
    {
        if(args[0] === undefined)
            return message.content.send("You must enter a new prefix")
        let dbo = MongoUtil.getDb()
        var ascii = /^[ -~]+$/;
        if(!ascii.test(args[0]))
        {
            message.channel.send("That prefix is not allowed")
        }
        else
        {
            dbo.collection("servers").updateOne({id: message.guild.id}, {$set: {prefix: args[0]}}, (err, res) =>
            {
                if(err) throw err

                message.channel.send(`The command prefix has been changed to ${args[0]}`)
            })
        }
    }
}