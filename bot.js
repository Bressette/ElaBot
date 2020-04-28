const discord = require('discord.js');
const client = new discord.Client;
const gayNames = ["Bryce", "Ian", "Raymond", "Jom", "Parker", "Matthew", "Jimbo"];
const gayUserIds = ["<@!326546102537158666>", "<@!354954586529726465>", "<@!300054377505226752>", "<@!304475016936816640>", "<@289037025427062785>", "<@!447183354077380613>", "<@!289860934401392642>"];
const dbName = 'ela-bot'
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017'
// let db
let userTag

// function main() {
//     const client = new MongoClient(url, { useUnifiedTopology: true });
//     client.connect();

//     db = client.db(dbName);
//     const items = db.collection('users').find();

//     console.log("In console.log " + items.name);
    
//     //const admin = client.db(dbName).admin();
//     //console.log(await admin.serverStatus());
//     //console.log(await admin.listDatabases());
// }

MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.collection("users").findOne({name: "Bill"}, function(err, result) {
      if (err) throw err;

        console.log(result._id);

      if(result === null) {
          console.log("In if");
          dbo.collection("users").insertOne({ name: "Bill", amount: 5}, function(err, result) {
              if(err) throw err;
          });
      }


      else {
        dbo.collection("users").updateOne({ name: "Bill"}, { $set: {name: "Bill", amount: 10}}, function(err, res) {
            testVal = dbo.collection("users").findOne({name: "Bill"}, function(err, res2) {
                console.log(res2.amount)
            })
        })
      }
    //   db.close();
    });
  });

// main();

client.on('message', message => {
    //code used because my friends are not very creative and call each other gay every half second
    userTag = message.member.user.tag;
    content = message.content;

    if(content.trim().startsWith("e!", 0)) {
        content = content.substr(2, content.length)
        content = content.trim()
        if(content.localeCompare("daily") === 0) {
            
            message.channel.send("You claimed your daily reward of 5000$, You can claim it again in 24h")
            addBalance(userTag, 5000);
        }


        if(content.startsWith("coinflip", 0)) {
            console.log("In coinflip if")
            coinFlipStr = content.substr(8, content.length)
            coinFlipStr = coinFlipStr.trim()
            amount = parseInt(coinFlipStr)

            if(Math.floor(Math.random() * 2) === 1) {
                addBalance(userTag, amount)
            }
            else {
                addBalance(userTag, -Math.abs(amount))
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
              console.log("in if")
              dbo.collection("users").insertOne({ name: name, amount: amount}, function(err, result) {
                  if(err) throw err;
              });
          }
    
    
          else {
              console.log("in else")
            dbo.collection("users").updateOne({ name: name}, { $set: {name: name, amount: (result.amount + amount)}}, function(err, res) {
            })
          }
        });
      });
}



client.login("NzAzNDI3ODE3MDA5ODQwMTg4.XqOduA.SS_g1f36getFYGINMArKTzH7it0");
