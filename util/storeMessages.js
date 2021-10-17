const db = require('./mongoUtil');

module.exports =
    {
        name: "storeMessages",
        description: "stores the passed in array of messages into the database for future retrieval",
        async execute(messages)
        {
            const mongoDbObject = db.getDb();
            const storedMessages = [];
            messages.forEach(message => {
                if(Array.isArray(message)) {
                    message = message[1];
                }
                const attachmentUrlList = [];
                if(message.attachments?.size > 0) {
                    message.attachments.forEach(attachment => attachmentUrlList.push(attachment.url));
                }
                storedMessages.push(
                {
                    content: message.content,
                    guildId: message.guild.id,
                    channelId: message.channelId,
                    messageId: message.id,
                    pinned: message.pinned,
                    attachments: attachmentUrlList,
                    createdTimestamp: message.createdTimestamp,
                    authorId: message.author.id,
                    authorUsername: message.author.username,
                    authorDiscriminator: message.author.discriminator,
                    authorAvatar: message.author.avatarURL()
                })
            })
            const result = await mongoDbObject.collection("messages").insertMany(storedMessages);
            console.log(result);
        }
    }