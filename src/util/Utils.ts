import {MongoUtil} from "./mongoUtil";

export class Utils
{
    public static async getLoop(guild)
    {
        const dbo = MongoUtil.getDb()
        let result = await dbo.collection("servers").findOne({id: guild.id})
        if(result.loop === undefined)
        {
            dbo.collection("servers").updateOne({id: guild.id}, {$set: {loop:false}})
        }
        return result.loop
    }

    public static async getMention(content)
    {
        if(content.startsWith("<@") && content.endsWith(">"))
        {
            return content
        }

        else if(content.includes("@here") || content.includes("@everyone"))
        {
            return content
        }

        else
        {
            return null
        }
    }

    public static async getMessages(channel, limit)
    {
        const sum_messages = [];
        let last_id;

        while (true)
        {
            const options = { limit: 100,
                before: undefined
            };
            if (last_id)
            {
                options.before = last_id;
            }
            const messages = await channel.messages.fetch(options);
            sum_messages.push(...Array.from(messages));
            last_id = messages?.last()?.id;

            if (messages?.size !== 100 || sum_messages >= limit)
            {
                break;
            }
        }
        console.log('Size of sum_messages: ' + sum_messages.length);

        return sum_messages;
    }

    public static async getPrefix(message, args)
    {
        const dbo = MongoUtil.getDb()
        const result = await dbo.collection("servers").findOne({id: message.guild.id})
        if(result === null || result === undefined)
        {
            dbo.collection("servers").insertOne({id: message.guild.id, prefix: "-", loop: false}, (err, res) =>
            {
                if(err) throw err
                return "-"
            })
        }

        // dbo.collection("users").updateOne({ name: userId}, { $set: {date: date}}, function(err, res)

        else if(result.prefix === null || result.prefix === undefined)
        {
            dbo.collection("servers").updateOne({id: message.guild.id}, { $set: {prefix: "-"}}, (err, res) =>
            {
                if(err) throw err
                return "-"
            })
        }

        else
            return result.prefix
    }

    public static isUrl(linkString)
    {
        const urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
        const url = new RegExp(urlRegex, 'i');

        return url.test(linkString)
    }

    public static async messageUrlCheck(content)
    {
        let status = false

        for(let i = 0; i < content.length; i++)
        {
            for(let j = i; j < content.length; j++)
            {
                const tempString = content.substring(i, j+1)
                if(Utils.isUrl(tempString))
                {
                    return true
                }
            }
        }

        return status
    }

    public static async pushMessages(messages, destination)
    {
        for(const i of messages)
        {
            destination.push(i)
        }

        return destination
    }

    public static async storeMessages(messages)
    {
        const mongoDbObject = MongoUtil.getDb();
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
