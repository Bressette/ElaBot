const getMessages = require('./../../util/getMessages');
const pushMessages = require('./../../util/pushMessages');
const storeMessages = require('./../../util/storeMessages');
const getMentions = require('./../../util/getMention');
const isUrl = require('./../../util/isUrl');
const mongoUtil = require('./../../util/mongoUtil');

module.exports =
    {
        name: "linkcount",
        description: "Returns the amount of links a given user has posted",
        aliases: [],
        async execute(message, args)
        {
            const dbo = mongoUtil.getDb();
            if(getMentions.execute(args[0])) {
                const authorId = args[0].replace(/\D/g, '');
                let linkCount = 0;
                const result = await dbo.collection("messages").find({authorId: authorId, guildId: message.guild.id}).toArray();
                result.forEach(doc => {
                    if(isUrl.execute(doc.content)) {
                        linkCount++;
                    }
                })
                message.channel.send(`${args[0]} has sent ${linkCount} links in this server`);
            }
        }
    }