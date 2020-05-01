const discord = require('discord.js');
const client = new discord.Client;
const gayNames = ["Bryce", "Ian", "Raymond", "Jom", "Parker", "Matthew", "Jimbo"];
const gayUserIds = ["<@!326546102537158666>", "<@!354954586529726465>", "<@!300054377505226752>", "<@!304475016936816640>", "<@289037025427062785>", "<@!447183354077380613>", "<@!289860934401392642>"];
const dbName = 'ela-bot'
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017'
let userTag
const economy = require('./economy')


client.on('message', message => {
    //code used because my friends are not very creative and call each other gay every half second
    userTag = message.member.user.tag;
    content = message.content;

    // console.log("The message content is: " + message.content)
    // console.log("Bryce's tag is: " + users.get(326546102537158666))
    //message.channel.send(":cherries:")

    if(content.trim().startsWith("e!", 0)) {
        content = content.substr(2, content.length)
        content = content.trim()

        console.log("The value of content is: " + content)
        switch(content) {
            case "daily":
                const localTag = message.member.user.tag
                message.channel.send("You claimed your daily reward of 69420$, You can claim it infinitely (Time WIP)")
                economy.addBalance(localTag, 69420);
                setTimeout(function() {
                    economy.messageCurrentBalance(localTag, message);
                }, 100)
                break;
        case "balance":
            economy.messageCurrentBalance(userTag, message);
            break;
        }

        if(content.startsWith("coinflip", 0)) {
            coinFlipStr = content.substr(8, content.length)
            coinFlipStr = coinFlipStr.trim()
            amount = parseInt(coinFlipStr)

            if(!isNaN(amount)) {

                const localTag = message.member.user.tag
                if(Math.floor(Math.random() * 2) === 1) {
                    economy.addBalance(userTag, amount)
                    economy.getBalance(userTag, function(totalBalance) {
                        message.channel.send("You won the coinflip and " + amount);
                    })
                }
                else {
                    economy.addBalance(userTag, -Math.abs(amount))
                    economy.getBalance(userTag, function(totalBalance) {
                        message.channel.send("You lost the coinflip and " + amount);
                    })
                }

                setTimeout(function() {
                    economy.messageCurrentBalance(localTag, message)
                }, 100)
                

            }
        }

        for(var i in gayNames) {
            if(content.toLowerCase().includes(gayNames[i].toLowerCase())) {
                message.channel.send(gayUserIds[i] + " is Gay");
            }
        }
    }

});

client.login("NzAzNDI3ODE3MDA5ODQwMTg4.XqOduA.SS_g1f36getFYGINMArKTzH7it0");
