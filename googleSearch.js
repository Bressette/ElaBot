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
                results = [""]
                j = 0
                k = 1
                for(i in images)
                {
                    if(k % 6 === 0)
                        j++
                    if(results[j] === undefined)
                    {
                        results[j] = ""
                    }
                    
                    results[j] += (images[i].url + "\n")
                    k++
                }

                for(i in results)
                    message.channel.send(results[i])
            }

            else
            {
                i = 0
                while(images[i].url.includes("fbsbx.com"))
                {
                    i++
                }
                message.channel.send(images[i].url)
            }

            
        }).catch(error => console.log(error))
    },

    dominantColorOption : (content) =>
    {
        
    }
}
