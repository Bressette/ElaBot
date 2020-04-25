const discord = require('discord.js');
const client = new discord.Client;
const gayNames = ["Bryce", "Ian", "Raymond"];

client.on('message', message => {
    //code used because my friends are not very creative and call each other gay every half second
    for(var i in gayNames) {
        if(message.content.toLowerCase().includes(gayNames[i].toLowerCase())) {
            message.channel.send("Gay");
        }
    }
});

client.login("NzAzNDI3ODE3MDA5ODQwMTg4.XqOduA.SS_g1f36getFYGINMArKTzH7it0");
