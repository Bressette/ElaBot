import {MongoUtil} from "../../util/mongoUtil.js";
import {Utils} from "../../util/Utils.js";

export class ReturnLinkCount
    {
        public static commandName = "linkcount";
        public static description = "Returns the amount of links a given user has posted";
        public static aliases = [];
        public static async execute(message, args)
        {
            const dbo = MongoUtil.getDb();
            if(Utils.getMention(args[0])) {
                const authorId = args[0].replace(/\D/g, '');
                let linkCount = 0;
                const result = await dbo.collection("messages").find({authorId: authorId, guildId: message.guild.id}).toArray();
                result.forEach(doc => {
                    if(Utils.isUrl(doc.content)) {
                        linkCount++;
                    }
                })
                message.channel.send(`${args[0]} has sent ${linkCount} links in this server`);
            }
        }
    }
