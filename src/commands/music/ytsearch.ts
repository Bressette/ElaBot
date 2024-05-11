import * as search from 'ytsr';
import {Video} from "ytsr";

export class Ytsearch
{
    public static commandName = "ytsearch";
    public static description = "Prints out the search results for a given query";
    public static aliases = [];
    public static async execute(message, args)
    {
        const searchKeywords = message.content.substr(message.content.indexOf(args[0]), message.content.length)
        const options = {limit: 10}
        const values = await search(searchKeywords, options)
        let returnStr = ""
        for(let i in values.items)
        {
            if(((values.items[i]) as Video).title != undefined)
            {
                returnStr += ((values.items[i]) as Video).title + "\n"
            }
        }

        message.channel.send(returnStr)
    }
}
