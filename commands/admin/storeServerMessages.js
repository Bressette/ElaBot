

const getMention = require('./../../util/getMention');
const getMessages = require('./../../util/getMessages');
const pushMessages = require('./../../util/pushMessages');
const fs = require('fs');

const getMethods = (obj) => {
    let properties = new Set()
    let currentObj = obj
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    } while ((currentObj = Object.getPrototypeOf(currentObj)))
    return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}



module.exports =
{
    name: "storeserver",
    description: "Stores all of the messages in the current server in a txt file",
    aliases: [],
    async execute(message, args)
    {
        console.log('Collecting all of the messages in the server');
        let channels = await message.guild.channels.fetch();
        console.log(`Channels: ${JSON.stringify(channels)}`);
        let allMessages = [];
        for (const [key, value] of channels.entries()) {
            console.log('Iterating over element: ' + JSON.stringify(value));
            if(value.isText()) {
                console.log('Fetching the message for channel');
                let messages = await getMessages.execute(value, 1000000);
                console.log('About to push retrieved messages: ' + messages.length);
                allMessages = pushMessages.execute(messages, allMessages);
                console.log('Pushed messages into allMessages: ' + allMessages.length);
            }
            console.log('After if statement');
        }
        console.log('Length of all messages: ' + allMessages.length);
        console.log('About to sort all messages');
        allMessages.sort(function(a, b)
        {
            return new Date(a.createdAt) - new Date(b.createdAt)
        })
        let outputString = '';
        let undefinedElements = [];
        let guildMembers = await message.guild.members.fetch();
        console.log(`Guild members: ${JSON.stringify(guildMembers)}`);
        for(let i of allMessages) {
            if(i?.attachments?.size > 0) {
                let pictureUrl = i.attachments.array()[0].url;
                i.content += ` ${pictureUrl}`;
            }
            const authorTag = i[1].author.username;
            // console.log('Author tag is: ' + authorTag);
            outputString += `[${new Date(i[1].createdTimestamp).toLocaleString()}] ${authorTag}::\n${i[1].content}\n`;
        }
        console.log('Amount of undefined elements: ' + undefinedElements.length);
        console.log('About to write to servermessages.txt');
        fs.writeFileSync('servermessages.txt', outputString);
        console.log('Val of output string: ' + outputString);
    }
}