export class GetMention
{
    static commandName = "getMention";
    static description = "Returns the mention if the message includes a mention, otherwise returns null";
    static execute(content)
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
}