// @ts-ignore
var getBalance = require('./util/getbalance');
module.exports =
    {
        name: "balance",
        description: "Retrieves the users balance",
        aliases: [],
        execute: function (message, args) {
            getBalance.execute(message.author.id, function (amount) {
                message.channel.send("Your current balance is: " + amount);
            });
        }
    };
//# sourceMappingURL=balance.js.map