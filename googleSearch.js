const imageSearch = require('image-search-google')
const config = require('./config.json')
 
const client = new imageSearch(config.csekey, config.googlekey)
options = {page:1}

let isFullResults


module.exports =
{
    search : (message, content) =>
    {
        content = content.substr(11, content.length).trim().toLowerCase()
        if(content.includes("-full"))
        {
            isFullResults = true
            content = content.substr(5, content.length).trim()
        }
        else
            isFullResults = false

        if(content.includes("-huge"))
        {
            content.substr(5, content.length)
            options = {page:1, size: "huge"}
        }
            
        else if(content.includes("-icon"))
        {
            content.substr(5, content.length)
            options = {page:1, size: "icon"}
        }
            
        else if(content.includes("-large"))
        {
            content.substr(6, content.length)
            options = {page:1, size: "large"}
        }
            
        else if(content.includes("-medium"))
        {
            content.substr(7, content.length)
            options = {page:1, size: "medium"}
        }
            
        else if(content.includes("-small"))
        {
            content.substr(6, content.length)
            options = {page:1, size: "small"}
        }
            
        else if(content.includes("-xlarge"))
        {
            content.substr(7, content.length)
            options = {page:1, size: "xlarge"}
        }
            
        else if(content.includes("-xxlarge"))
        {
            content.substr(8, content.length)
            options = {page:1, size: "xxlarge"}
        }
        else
        {
            options = {page:1}
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
    },

    dominantColorOption : (content) =>
    {
        
    }
}
