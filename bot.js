const discord = require('discord.js');
const client = new discord.Client;
const gayNames = ["Bryce", "Ian", "Raymond", "Jom", "Parker", "Matthew", "Jimbo"];
const gayUserIds = ["<@!326546102537158666>", "<@!354954586529726465>", "<@!300054377505226752>", "<@!304475016936816640>", "<@289037025427062785>", "<@!447183354077380613>", "<@!289860934401392642>"];
const dbName = 'ela-bot'
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017'
let userTag
const economy = require('./economy')

const sekiroReview = "First off, fuck this game. It sucks so much id rather remove kidney stones with a fucking pencil than attemept this stupid ass game again. No replay value, saying that you can actually get through it. i not only spent 3.5 hours on a miniboss i also picked up a habit of beating my children. This game is the worst FromSoftware game ever. If you do beat a boss there is not reward for it. Only the knowledge that there is a frggin 5x harder enemy after this and moving between bosses is like sliding from 1 fucking god awful shit filled pen to another shit filled pen. I used these fucking beads to upgrade what i do. However it seems From forgot to program them to do anything, and in fact once you upgrade there is just a confetti sound and a sound byte that says you are a retard. People used to say that dark souls is harder but i think this one is hardest as i have literally 0 motivation to move on the the next boss. This is not a game for a dark souls player. This game is zero fun to me however i got a steam controller for just 15 dollars and another game to inflate my game library. I spent more time on the Minibosses as opposed to the actual game. I hear there is a way to upgrade your character but i have died so much all the main characters have gotten dragon rot and i dont care anymore. I have had upwards of 6 characters with dragonrot and you know what i hope they die. as i have had to die so much i want some form of misery to be upon another. Im pretty sure this game has allowed me to understand that i am a psychopath. God this game infuriates so much i think im going to unistall it and literally never play it again. \n\n\nfuck this game. \n\nRecommended if you like a small challenge\nFYI if you think im making this ironically, no i literally hate this game to its very goddamn core id have more fun knitting my own noose while in prison for fucking a bear than play this game for a single minute more.\n-<@!326546102537158666> when he played Sekiro like a Dark Souls game"


client.on('ready', () => {
    client.user.setPresence({ activity: { name: 'Rainbow Six Siege', type: "WATCHING", url: 'https://www.youtube.com/channel/UCDsShdUQolkO3N0bn6VcTNg'}, status: 'online' }).then(console.log)
    .catch(console.error)
 });

client.on('message', message => {
    //code used because my friends are not very creative and call each other gay every half second
    userTag = message.member.user.tag;
    content = message.content;

    

    
    // console.log("The message content is: " + message.content)
    //message.channel.send(":cherries:")

    if(content.trim().startsWith("e!", 0)) {
        content = content.substr(2, content.length)
        content = content.trim()

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

        if(content.startsWith("sekiro", 0)) {
                message.channel.send(sekiroReview)
        }

        for(var i in gayNames) {
            if(content.toLowerCase().includes(gayNames[i].toLowerCase())) {
                message.channel.send(gayUserIds[i] + " is Gay");
            }
        }
    }

});

client.login("NzAzNDI3ODE3MDA5ODQwMTg4.XqOduA.SS_g1f36getFYGINMArKTzH7it0");
