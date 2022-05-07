const imageSearch = require('image-search-google')
const config = require('./../../config.json')
 
const client = new imageSearch(config.csekey, config.googlekey)
options = {page:1}

let isFullResults

module.exports = 
{
    name: "imagesearch",
    description: "Searches for images using google image search",
    aliases: [],
    async execute(message, args)
    {
        let content = message.content.substr(message.content.indexOf(args[0]), message.content.length)
        if(content.includes("-full"))
        {
            isFullResults = true
            content = content.substr(5, content.length).trim()
        }
        else
            isFullResults = false

        try {

            let images = await client.search(content, options)
            if(images)
            {
                if(isFullResults)
                {
                    let results = [""]
                    let j = 0
                    let k = 1
                    for(const i in images)
                    {
                        if(images[i].url.includes("fbsbx.com"))
                            continue
                        console.log(i)
                        if(k % 6 === 0)
                            j++
                        if(results[j] === undefined)
                        {
                            results[j] = ""
                        }
                        console.log("I in images")
                        message.channel.send(images[i].url)
                        k++
                    }
                }

                else
                {
                    let i = 0
                    while(images[i].url.includes("fbsbx.com"))
                    {
                        i++
                    }
                    message.channel.send(images[i].url)
                }
            }

            else
                message.channel.send("There are no images for that query")

        } catch(images) {
            message.channel.send("Error fetching image")
            console.log(images)
        }
    }
}
