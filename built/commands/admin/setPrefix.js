"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoUtil_1 = require("../../util/mongoUtil");
module.exports = {
    name: "setprefix",
    description: "sets the prefix used to give the bots commands ex: -prefix !(Sets the new prefix to !)",
    aliases: [],
    execute: function (message, args) {
        if (args[0] === undefined)
            return message.content.send("You must enter a new prefix");
        var dbo = mongoUtil_1.MongoUtil.getDb();
        var ascii = /^[ -~]+$/;
        if (!ascii.test(args[0])) {
            message.channel.send("That prefix is not allowed");
        }
        else {
            dbo.collection("servers").updateOne({ id: message.guild.id }, { $set: { prefix: args[0] } }, function (err, res) {
                if (err)
                    throw err;
                message.channel.send("The command prefix has been changed to ".concat(args[0]));
            });
        }
    }
};
//# sourceMappingURL=setPrefix.js.map