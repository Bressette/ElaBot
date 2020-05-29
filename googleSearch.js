const imageSearch = require('image-search-google')
const config = require('./config.json')
 
const client = new imageSearch(config.csekey, config.googlekey)
const options = {page:1}

let isFullResults


module.exports =
{
    search : (message, content) =>
    {
        content = content.substr(11, content.length).trim()
        if(content.startsWith("-full"))
        {
            isFullResults = true
            content = content.substr(5, content.length).trim()
        }

        else
        {
            isFullResults = false
        }

        client.search(content, options)
        .then(images =>
        {
            if(isFullResults)
            {
                results = ["",""]
                for(i in images)
                {
                    if(i < 5)
                        results[0] += (images[i].url + "\n")
                    else if(i < 10)
                        results[1] += (images[i].url + "\n")
                }

                message.channel.send(results[0])
                message.channel.send(results[1])
            }

            else
            {
                message.channel.send(images[0].url)
            }

            
        }).catch(error => console.log(error))
    }
}
