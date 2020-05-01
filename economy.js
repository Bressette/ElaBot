const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017'
const dbName = 'ela-bot'

module.exports = {

    addBalance : function addBalance(name, amount) {
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if (err) 
            {
                throw err;
            }
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
    },

    getBalance : function getBalance(name, fn) {
        
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {

            if (err) throw err;

            var dbo = db.db(dbName);

            dbo.collection("users").findOne({name: name}, function(err, result) {

            if (err) {
                throw err;
            }

            if(result === null) {
                dbo.collection("users").insertOne({ name: name, amount: 0}, function(err, result) {
                    if(err) throw err;

                    fn(0)
                });
            }
        
            else {
                fn(result.amount)
            }
            
            });
        });
    },

    messageCurrentBalance : function messageCurrentBalance(userTag, message) {
        module.exports.getBalance(userTag, function(amount) {
            message.channel.send("Your current balance is: " + amount);
        })
    }
}