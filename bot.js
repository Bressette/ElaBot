const discord = require('discord.js')
const client = new discord.Client
const userManager = new discord.UserManager
const dbName = 'ela-bot'
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017'
const economy = require('./economy')
const token = require('./token.json')

const sekiroReview = "First off, fuck this game. It sucks so much id rather remove kidney stones with a fucking pencil than attemept this stupid ass game again. No replay value, saying that you can actually get through it. i not only spent 3.5 hours on a miniboss i also picked up a habit of beating my children. This game is the worst FromSoftware game ever. If you do beat a boss there is not reward for it. Only the knowledge that there is a frggin 5x harder enemy after this and moving between bosses is like sliding from 1 fucking god awful shit filled pen to another shit filled pen. I used these fucking beads to upgrade what i do. However it seems From forgot to program them to do anything, and in fact once you upgrade there is just a confetti sound and a sound byte that says you are a retard. People used to say that dark souls is harder but i think this one is hardest as i have literally 0 motivation to move on the the next boss. This is not a game for a dark souls player. This game is zero fun to me however i got a steam controller for just 15 dollars and another game to inflate my game library. I spent more time on the Minibosses as opposed to the actual game. I hear there is a way to upgrade your character but i have died so much all the main characters have gotten dragon rot and i dont care anymore. I have had upwards of 6 characters with dragonrot and you know what i hope they die. as i have had to die so much i want some form of misery to be upon another. Im pretty sure this game has allowed me to understand that i am a psychopath. God this game infuriates so much i think im going to unistall it and literally never play it again. \n\n\nfuck this game. \n\nRecommended if you like a small challenge\nFYI if you think im making this ironically, no i literally hate this game to its very goddamn core id have more fun knitting my own noose while in prison for fucking a bear than play this game for a single minute more."


client.on('ready', () => 
{
    client.user.setPresence(
        { activity: 
            { name: 'Rainbow Six Siege', 
            type: "WATCHING", 
            url: 'https://www.youtube.com/channel/UCDsShdUQolkO3N0bn6VcTNg'}, status: 'online' }).then(console.log)
    .catch(console.error)
 })




client.on('message', message => {
    
    userTag = message.member.user.tag
    userId = message.member.user.id
    content = message.content

    //changes all characters to lower case to allow the commands to not be case sensitive
    content = content.toLowerCase()

    //check if content starts with the command prefix e!
    if(content.trim().startsWith("e!", 0)) 
    {
        //removes e! from the content string
        content = content.substr(2, content.length).trim()

        //create a command string to hold the command keyword
        command = content
        if(command.includes(" ")) 
        {
            command = command.substr(0, content.indexOf(" "))
        }

        
        //switch statement to determine what command the user used
        switch(command) 
        {
            case "daily":
                economy.daily(userId, message, 5000)
                break
            case "balance":
                economy.messageCurrentBalance(userId, message)
                break
            case "coinflip":
                economy.coinflip(content, message, userId)
                break
            case "give":
                economy.give(content, message, userId)
                break
            case "leaderboard":
                economy.leaderboard(message, client)
                break
            case "sekiro":
                message.channel.send(sekiroReview)
                break
        }

    
        
    }

})

client.login(token.token)
