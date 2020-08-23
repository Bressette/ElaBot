const ytdl = require('ytdl-core')
const search = require('ytsr')
const db = require('./../../util/mongoUtil')
const { play } = require('../../music')
const getLoop = require('./../../util/getLoop')
const printQueue = require('./queue')

module.exports = 
{
    name: "play",
    description: "Searches and plays a song from youtube",
    aliases: ['p'],
    async execute(message, args)
    {
        serverQueue = message.client.queue.get(message.guild.id)

        content = message.content

      if((content === "play" || content === "p") && serverQueue.connection.dispatcher.paused)
      {
          return serverQueue.connection.dispatcher.resume()
      }

      content = content.substr(content.indexOf(args[0]), content.length)
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

        searchKeywords = content
        link = ""
        if(ytdl.validateURL(searchKeywords))
            link = searchKeywords
        else
        {
            options = {limit: 10}
            values = await search(searchKeywords, options)
            
            if(values.items.length != 0)
            {
                i = 0
                while(values.items[i].type === "playlist" || values.items[i].type === "channel" || values.items[i].link === undefined || values.items[i].type === "movie")
                {
                    i++
                }

                if(values.items[i].link === undefined)
                    link = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                else
                    link = values.items[i].link
            }

            else
            {
                message.channel.send("That video does not exist!")
                link = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            }
        }

        // console.log(i)
        console.log(link)
        console.log(values)
        try
        {
            songInfo = await ytdl.getInfo(link)
        } catch(err) {
            console.log(err)
            i++
            songInfo = await ytdl.getInfo(values.items[i].link)
        } 
        
        

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
      
          message.client.queue.set(message.guild.id, queueContruct);
      
          queueContruct.songs.push(song);
      
          try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            module.exports.play(message, message.guild, queueContruct.songs[0]);
          } catch (err) {
            console.log(err);
            message.client.queue.delete(message.guild.id);
            return message.channel.send(err);
          }
        } else 
        {
            console.log(message)
            if(message.content.startsWith("-restart"))
                serverQueue.songs.unshift(song)
            else
            {
                serverQueue.songs.push(song);
                message.channel.send(`${song.title} has been added to the queue!`);
                printQueue.execute(message, args)
            }
          
        }
    },

    async play(message, guild, song)
    {
        const serverQueue = message.client.queue.get(guild.id);
        if (!song) {
          serverQueue.voiceChannel.leave();
          message.client.queue.delete(guild.id);
          return;
        }

        const dispatcher = serverQueue.connection
          .play(ytdl(song.url))
          .on("finish", async() => {

            loop = await getLoop.execute(guild)
            if(loop === undefined)
                loop = false

            if(!loop)
              serverQueue.songs.shift();

            module.exports.play(message, guild, serverQueue.songs[0]);
          })
          .on("error", error => console.log("In Error"));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

        loop = await getLoop.execute(guild)
        if(loop === undefined)
            loop = false
        if(!loop)
          serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    }
}