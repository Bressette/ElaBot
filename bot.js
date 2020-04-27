const discord = require('discord.js');
const client = new discord.Client;
const gayNames = ["Bryce", "Ian", "Raymond", "Jom", "Parker", "Matthew", "Jimbo"];
const gayUserIds = ["<@!326546102537158666>", "<@!354954586529726465>", "<@!300054377505226752>", "<@!304475016936816640>", "<@289037025427062785>", "<@!447183354077380613>", "<@!289860934401392642>"];
const dbName = 'ela-bot'
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017'
let db
let userTag

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, dbClient) => {
    if(err) return console.log(err)
    db = dbClient.db(dbName)
    console.log(`Connected MongoDB: ${url}`)
    console.log(`Database: ${dbName}`)
})

client.on('message', message => {
    //code used because my friends are not very creative and call each other gay every half second
    userTag = message.member.user.tag;
    content = message.content;

    if(content.trim().startsWith("e!", 0)) {
        content = content.substr(2, content.length)
        content = content.trim()
        if(content.localeCompare("daily") === 0) {
            message.channel.send("You claimed your daily reward of 5000$, You can claim it again in 24h")
        }

        for(var i in gayNames) {
            if(content.toLowerCase().includes(gayNames[i].toLowerCase())) {
                message.channel.send(gayUserIds[i] + " is Gay");
            }
        }
    }

    
});

client.login("NzAzNDI3ODE3MDA5ODQwMTg4.XqOduA.SS_g1f36getFYGINMArKTzH7it0");
