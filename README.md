# ElaBot
A discord.js based Discord Bot that I built for my personal servers.  
The bot currently contains the following command categories:
- Admin  
basic admin commands for kicking/banning deleting messages  
- Music  
plays youtube videos based on search terms or direct links  
- Image Search  
searches google images through a google custom search engine API
- Management Endpoints  
Express.js endpoints lets you retrieve data about the server and write messages as the bot using a REST client
- Economy  
Basic economy management commands and gambling through a conflip and slots command

# Installation
The bot requires an installation of MongoDB on your system. MongoDB Community can be installed for your operatin system [here](https://www.mongodb.com/try/download/community)  
A config.json file is also required in the base directory of the bot, at the same level as the bot.js file. This file contains your bot api key and your google custom search engine API key.  

    {
        "token" : "<bot token goes here>",
        "googlekey" : "<google cse api key goes here>"
    }  
    
A valid installation of Python 3.2+ is required. Download [Python](https://www.python.org/)  
Run an npm install to install the necessary dependencies and then you can run the app using the node command or use PM2 to manage the process.  

    npm install  
    node bot.js
    pm2 start bot.js

