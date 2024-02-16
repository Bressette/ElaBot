import {IsUrl as isUrl} from "./isUrl.js";

export class MessageUrlCheck
{
    static commandName = "messageUrlCheck";
    static description = "Checks if a message contains a url";
    static execute(content)
    {
        let status = false

        for(let i = 0; i < content.length; i++)
        {
            for(let j = i; j < content.length; j++)
            {
                const tempString = content.substring(i, j+1)
                if(isUrl.execute(tempString))
                {
                    return true
                }
            }
        }

        return status
    }
}
