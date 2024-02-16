// @ts-ignore
import {GetMessages as getMessages} from "../../util/getMessages.js";
import {PushMessages as pushMessages} from "../../util/pushMessages.js";
import {StoreMessages as storeMessages} from "../../util/storeMessages.js";

export class StoreServerMessages
{
    static commandName = "storeserver";
    static description = "Stores all of the messages in the current server in a mongodb database";
    static aliases = [];
    static async execute(message, args)
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