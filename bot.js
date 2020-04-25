const discord = require('discord.js');
const client = new discord.Client;
const gayNames = ["Bryce", "Ian", "Raymond"];
const gayUserIds = ["<@!326546102537158666>", "<@!354954586529726465>", "<@!300054377505226752>"];

client.on('message', message => {
    //code used because my friends are not very creative and call each other gay every half second
    for(var i in gayNames) {
        if(message.content.toLowerCase().includes(gayNames[i].toLowerCase())) {
            message.channel.send(gayUserIds[i] + " Gay");
        }
    }
});

client.login("NzAzNDI3ODE3MDA5ODQwMTg4.XqOduA.SS_g1f36getFYGINMArKTzH7it0");
