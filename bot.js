const discord = require('discord.js')
const client = new discord.Client
const mongoUtil = require('./mongoUtil.js')
const economy = require('./economy')
const admin = require('./admin')
const config = require('./config.json')
const copyPastas = require('./copy-pastas.json')
const music = require('./music.js')
const queue = new Map()
const ytdl = require('ytdl-core')
const search = require('youtube-search')

var opts = {
    maxResults: 10,
    key: config.googlekey
}

mongoUtil.connectToServer(() =>
{
})

slotSize = 5

client.on('ready', () => 
{
    client.user.setPresence(
        { activity: 
            { name: 'Rainbow Six Siege', 
            type: "WATCHING", 
            url: 'https://www.youtube.com/channel/UCDsShdUQolkO3N0bn6VcTNg'}, status: 'online' }).then()
    .catch(console.error)
 })

client.on('message', async message => 
{
    if(message.author.bot)
        return
    userTag = message.member.user.tag
    userId = message.member.user.id
    content = message.content

    
    //check if content starts with the command prefix e!
    if(content.trim().startsWith("e!", 0) || content.trim().startsWith("-",0)) 
    {
        if(content.trim().startsWith("e!", 0))
            content = content.substr(2, content.length).trim()
        else
            content = content.substr(1, content.length).trim()

        //create a command string to hold the command keyword
        command = content.toLowerCase()
        if(command.includes(" ")) 
        {
            command = command.substr(0, content.indexOf(" "))
        }

        const serverQueue = queue.get(message.guild.id)

        //switch statement to determine what command the user used
        switch(command) 
        {
            case "daily":
                economy.daily(userId, message, 5000)
                break
            case "balance":
                economy.messageCurrentBalance(userId, message)
                break
            case "coinflip":
                economy.coinflip(content, message, userId)
                break
            case "slots":
                economy.slots(content, message, userId, slotSize)
                break
            case "give":
                economy.give(content, message, userId)
                break
            case "leaderboard":
                economy.leaderboard(message, client)
                break
            case "slotsize":
                slotSize = economy.slotSize(content, message, slotSize)
                break
            case "getslotsize":
                message.channel.send("The slot size is: " + slotSize)
                break
            case "kick":
                admin.kick(message)
                break
            case "ban":
                admin.ban(message)
                break
            case "sekiro":
                message.channel.send(copyPastas.sekiro)
                break
            case "play":
                searchKeywords = content.substr(4, content.length)
                search(searchKeywords, opts, function(err, results) 
                {
                    if(err) return console.log("This is an error\n" + err)

                    execute(message, results[0].link, serverQueue)

                })
                break
            case "p":
                searchKeywords = content.substr(4, content.length)
                console.log(searchKeywords)
                search(searchKeywords, opts, function(err, results) 
                {
                    if(err) return console.log("This is an error\n" + err)

                    for(i in results)
                    {
                      console.log(results[i].link + "\n")
                    }
                    console.log(results[0].link)
                    execute(message, results[0].link, serverQueue)

                })
                break
            case "r":
                stop(message, serverQueue)
                break
            case "skip":
                skip(message, serverQueue)
                break
            case "reset":
                stop(message, serverQueue)
                break
                
        }
    }
})

async function execute(message, link, serverQueue) {
    
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to play music!"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }
  
    const songInfo = await ytdl.getInfo(link);
    const song = {
      title: songInfo.title,
      url: songInfo.video_url
    };
  
    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };
  
      queue.set(message.guild.id, queueContruct);
  
      queueContruct.songs.push(song);
  
      try {
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        play(message.guild, queueContruct.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
  }
  
  function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
  }
  
  function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }
  
  function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
  
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Started playing: **${song.title}**`);
  }

client.login(config.token)
