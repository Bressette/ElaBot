const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017'
const dbName = 'ela-bot'

module.exports = 
{
    addBalance : function addBalance(name, amount) 
    {
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) 
        {
            if (err) 
            {
                throw err;
            }
            var dbo = db.db(dbName);
            dbo.collection("users").findOne({name: name}, function(err, result) {
            if (err) throw err;
        
            if(result === null) 
            {
                dbo.collection("users").insertOne({ name: name, amount: amount}, function(err, result) 
                {
                    if(err) throw err;
                });
            }
            else 
            {
                dbo.collection("users").updateOne({ name: name}, { $set: {name: name, amount: (result.amount + amount)}}, function(err, res) {
                })
            }
            });
        });
    },

    getBalance : function getBalance(name, fn) {
        
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) 
        {
            if (err) throw err;
            var dbo = db.db(dbName);

            dbo.collection("users").findOne({name: name}, function(err, result) {
            if (err) 
            {
                throw err;
            }

            if(result === null) 
            {
                dbo.collection("users").insertOne({ name: name, amount: 0}, function(err, result) 
                {
                    if(err) throw err;
                    fn(0)
                });
            }
        
            else 
            {
                fn(result.amount)
            }
            
            });
        });
    },

    messageCurrentBalance : function messageCurrentBalance(userTag, message) 
    {
        module.exports.getBalance(userTag, function(amount) 
        {
            message.channel.send("Your current balance is: " + amount);
        })
    },

    daily : function getDailyReward(userId, message, dailyAmount) 
    {
        message.channel.send("You claimed your daily reward of $" + dailyAmount +  ", You can claim it infinitely (Time WIP)")
        module.exports.addBalance(userId, dailyAmount);
        setTimeout(function() 
        {
            module.exports.messageCurrentBalance(userId, message);
        }, 100)
    },

    coinflip : function coinflip(content, message, userId)
    {
        amount = parseInt(content.substr(8, content.length).trim())

        module.exports.getBalance(userId, function(balance) {
            if(amount > balance)
            {
                message.channel.send("You cannot coinflip more than you have!")
            }

            else if(!isNaN(amount)) 
            {
                if(Math.floor(Math.random() * 2) === 1) 
                {
                    module.exports.addBalance(userId, amount)
                    message.channel.send("You won the coinflip and " + amount);
                }

                else 
                {
                    module.exports.addBalance(userId, -Math.abs(amount))
                    message.channel.send("You lost the coinflip and " + amount);
                }

                setTimeout(function() 
                {
                    module.exports.messageCurrentBalance(userId, message)
                }, 100)
            }
        })
    },

    give : function give(content, message, userId) 
    {
        content = content.substr(4, content.length).trim()
        console.log("The value of content is: " + content)
        module.exports.getBalance(userId, (amount) => {
            targetUserId = content.split(" ")[0]
            if(targetUserId.includes("!"))
            {
                targetUserId = targetUserId.split("!")[1].split(">")[0]
            }

            else if(targetUserId.includes("@"))
            {
                targetUserId = targetUserId.split("@")[1].split(">")[0];
            }

            targetValue = content.split(" ")[1]
            module.exports.addBalance(userId, -Math.abs(targetValue))
            module.exports.addBalance(targetUserId, targetValue)
            message.channel.send(targetValue + " was given to " + "<@" + targetUserId + ">")
        })
    }
}