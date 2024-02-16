import {GetMention as getMentions} from "../../util/getMention.js";
import {IsUrl as isUrl} from "../../util/isUrl.js";
import {MongoUtil} from "../../util/mongoUtil.js";

export class ReturnLinkCount {
    static commandName = "linkcount";
    static description = "Returns the amount of links a given user has posted";
    static aliases = [];

    static async execute(message, args) {
        const dbo = MongoUtil.getDb();
        if (getMentions.execute(args[0])) {
            const authorId = args[0].replace(/\D/g, '');
            let linkCount = 0;
            const result = await dbo.collection("messages").find({
                authorId: authorId,
                guildId: message.guild.id
            }).toArray();
            result.forEach(doc => {
                if (isUrl.execute(doc.content)) {
                    linkCount++;
                }
            })
            message.channel.send(`${args[0]} has sent ${linkCount} links in this server`);
        }
    }
}