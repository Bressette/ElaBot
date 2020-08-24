const search = require('ytsr')

module.exports = 
{
    name: "ytsearch",
    description: "Prints out the search results for a given query",
    aliases: [],
    async execute(message, args)
    {
        searchKeywords = message.content.substr(message.content.indexOf(args[0]), message.content.length)
        options = {limit: 10}
        values = await search(searchKeywords, options)
        returnStr = ""
        for(i in values.items)
        {
            if(values.items[i].title != undefined)
            {
                returnStr += values.items[i].title + "\n"
            }
        }

        message.channel.send(returnStr)
    }
}