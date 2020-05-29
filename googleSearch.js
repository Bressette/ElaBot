const imageSearch = require('image-search-google')
const config = require('./config.json')
 
const client = new imageSearch(config.csekey, config.googlekey)
const options = {page:1}

module.exports =
{
    search : (message, content) =>
    {
        content = content.substr(11, content.length).trim()
        console.log(content)
        client.search(content, options)
        .then(images =>
        {
            message.channel.send(images[0].url)
        }).catch(error => console.log(error))
    }
}
