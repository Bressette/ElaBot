const isUrl = require('src/util/isUrl');

module.exports =
{
    name: "messageUrlCheck",
    description: "Checks if a message contains a url",
    execute(content)
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
