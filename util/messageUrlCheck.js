module.exports = 
{
    name: "messageUrlCheck",
    description: "Checks if a message contains a url",
    execute(content)
    {
        status = false

        for(i = 0; i < content.length; i++)
        {
            for(j = i; j < content.length; j++)
            {
                tempString = content.substring(i, j+1)
                if(module.exports.isUrl(tempString))
                {
                    return true
                }
            }
        }

        return status
    }
}