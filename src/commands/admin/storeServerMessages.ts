// @ts-ignore
const getMessages = require('../../util/getMessages');
const pushMessages = require('../../util/pushMessages');
const storeMessages = require('../../util/storeMessages');

export class StoreServerMessages
{
    public static commandName = "storeserver";
    public static description = "Stores all of the messages in the current server in a mongodb database";
    public static aliases = [];
    public static async execute(message, args)
    {
        message.channel.send("Storing server content in the database");
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
        }
        console.log('Length of all messages: ' + allMessages.length);
        await storeMessages.execute(allMessages);
        message.channel.send("Successfully stored all server content");
    }
}
