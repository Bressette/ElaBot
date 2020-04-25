const discord = require('discord.js');
const client = new discord.Client;

client.on('message', message => {
    if (message.content.includes("Bryce") || message.content.includes("Ian") || message.content.includes("Raymond")) {
        message.channel.send("Placeholder Message");
    }
});

client.login("NzAzNDI3ODE3MDA5ODQwMTg4.XqOduA.SS_g1f36getFYGINMArKTzH7it0");
