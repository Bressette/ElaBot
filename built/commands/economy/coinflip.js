// @ts-ignore
var getBalance = require('./util/getbalance');
// @ts-ignore
var addBalance = require('./util/addbalance');
var balance = require('./balance');
module.exports =
    {
        name: "coinflip",
        description: "Coinflips a users balance doubling money if successfull",
        aliases: [],
        execute: function (message, args) {
            var userId = message.author.id;
            //parse the staked amount from the content string 
            var amount = parseInt(args[0]);
            //call get balance to check if the user entered a value value to stake
            getBalance.execute(userId, function (balance) {
                if (!isNaN(amount) && isFinite(amount)) {
                    if (amount > balance) {
                        message.channel.send("You cannot coinflip more than you have!");
                    }
                    else if (amount < 0) {
                        message.channel.send("You cannot coinflip a negative number!");
                    }
                    else if (amount === 0) {
                        message.channel.send("You cannot coinflip 0!");
                    }
                    //execute the coinflip otherwise
                    else {
                        if (Math.floor(Math.random() * 2) === 1) {
                            addBalance.execute(userId, amount);
                            message.channel.send("You won the coinflip and " + amount);
                        }
                        else {
                            addBalance.execute(userId, -Math.abs(amount));
                            message.channel.send("You lost the coinflip and " + amount);
                        }
                    }
                }
                else {
                    message.channel.send("You must enter a valid number to coinflip");
                }
            });
        }
    };
//# sourceMappingURL=coinflip.js.map