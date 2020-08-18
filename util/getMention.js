module.exports = 
{
    name: "getMention",
    description: "Returns the mention if the message includes a mention, otherwise returns null",
    execute(content)
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