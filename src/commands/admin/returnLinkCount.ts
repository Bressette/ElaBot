const getMessages = require('../../util/getMessages');
const pushMessages = require('../../util/pushMessages');
const storeMessages = require('../../util/storeMessages');
const getMentions = require('../../util/getMention');
const isUrl = require('../../util/isUrl');
import {MongoUtil} from "../../util/mongoUtil";

export class ReturnLinkCount
    {
        public static commandName = "linkcount";
        public static description = "Returns the amount of links a given user has posted";
        public static aliases = [];
        public static async execute(message, args)
        {
            const dbo = MongoUtil.getDb();
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
