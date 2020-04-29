const discord = require('discord.js');
const client = new discord.Client;
const gayNames = ["Bryce", "Ian", "Raymond", "Jom", "Parker", "Matthew", "Jimbo"];
const gayUserIds = ["<@!326546102537158666>", "<@!354954586529726465>", "<@!300054377505226752>", "<@!304475016936816640>", "<@289037025427062785>", "<@!447183354077380613>", "<@!289860934401392642>"];
const dbName = 'ela-bot'
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017'
let userTag



client.on('message', message => {
    //code used because my friends are not very creative and call each other gay every half second
    userTag = message.member.user.tag;
    content = message.content;

    //message.channel.send(":cherries:")

    if(content.trim().startsWith("e!", 0)) {
        content = content.substr(2, content.length)
        content = content.trim()

        console.log("The value of content is: " + content)
        switch(content) {
            case "daily":
                message.channel.send("You claimed your daily reward of 5000$, You can claim it infinitely (Time WIP)")
                addBalance(userTag, 5000);
                break;
        case "balance":
            messageCurrentBalance(userTag, message);
            break;
        }

        if(content.startsWith("coinflip", 0)) {
            coinFlipStr = content.substr(8, content.length)
            coinFlipStr = coinFlipStr.trim()
            amount = parseInt(coinFlipStr)

            if(!isNaN(amount)) {

                if(Math.floor(Math.random() * 2) === 1) {
                    addBalance(userTag, amount)
                    getBalance(userTag, function(totalBalance) {
                        message.channel.send("You won the coinflip and " + amount);
                    })
                }
                else {
                    addBalance(userTag, -Math.abs(amount))
                    getBalance(userTag, function(totalBalance) {
                        message.channel.send("You lost the coinflip and " + amount);
                    })
                }

            }
        }

        for(var i in gayNames) {
            if(content.toLowerCase().includes(gayNames[i].toLowerCase())) {
                message.channel.send(gayUserIds[i] + " is Gay");
            }
        }
    }

});

function addBalance(name, amount) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection("users").findOne({name: name}, function(err, result) {
          if (err) throw err;
    
          if(result === null) {
              
              dbo.collection("users").insertOne({ name: name, amount: amount}, function(err, result) {
                  if(err) throw err;
              });
          }
    
    
          else {
              
            dbo.collection("users").updateOne({ name: name}, { $set: {name: name, amount: (result.amount + amount)}}, function(err, res) {
            })
          }
        });
      });
}

function getBalance(name, fn) {
    let currentBalance
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection("users").findOne({name: name}, function(err, result) {
          if (err) throw err;
    
          if(result === null) {
              dbo.collection("users").insertOne({ name: name, amount: 0}, function(err, result) {
                  if(err) throw err;
              });
          }
    
          fn(result.amount)
        });
      });
}

function messageCurrentBalance(userTag, message) {
    getBalance(userTag, function(amount) {
        message.channel.send("Your current balance is: " + amount);
    })
}

client.login("NzAzNDI3ODE3MDA5ODQwMTg4.XqOduA.SS_g1f36getFYGINMArKTzH7it0");
