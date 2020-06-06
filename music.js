const ytdl = require('ytdl-core')
const search = require('ytsr')
const db = require("./mongoUtil.js")

const queue = new Map()


module.exports =
{
    execute : async function(message, content) {
      let results
      serverQueue = queue.get(message.guild.id)

      if((content === "play" || content === "p") && serverQueue.connection.dispatcher.paused)
      {
          return serverQueue.connection.dispatcher.resume()
      }

      if(content.startsWith("play"))
          searchKeywords = content.substr(4, content.length).trim()
      else
          searchKeywords = content.substr(1, content.length).trim()

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

        link = ""
        if(ytdl.validateURL(searchKeywords))
            link = searchKeywords
        else
        {
            options = {limit: 5}
            values = await search(searchKeywords, options)

            console.log(values)
            if(values.items.length != 0)
            {
                i = 0
                while(values.items[i].link === undefined)
                {
                    i++
                }
                while(values.items[i].link.includes("list=") || values.items[i].link.includes("/channel/"))
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
            module.exports.play(message.guild, queueContruct.songs[0]);
          } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
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
                return message.channel.send(`${song.title} has been added to the queue!`);
            }
          
        }
     
    },
      
      skip : function(message) {
        serverQueue = queue.get(message.guild.id)
        if (!message.member.voice.channel)
          return message.channel.send(
            "You have to be in a voice channel to stop the music!"
          );
        if (!serverQueue)
          return message.channel.send("There is no song that I could skip!");
        serverQueue.connection.dispatcher.end();
      },
      
      stop : function(message) {
        serverQueue = queue.get(message.guild.id)

        if(serverQueue.connection.dispatcher.paused)
            serverQueue.connection.dispatcher.resume()
        if (!message.member.voice.channel)
          return message.channel.send(
            "You have to be in a voice channel to stop the music!"
          );
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
      },
      
      play : async function(guild, song) {
        const serverQueue = queue.get(guild.id);
        if (!song) {
          serverQueue.voiceChannel.leave();
          queue.delete(guild.id);
          return;
        }

        
        
        const dispatcher = serverQueue.connection
          .play(ytdl(song.url))
          .on("finish", async() => {

            loop = await module.exports.getLoop(guild)
            if(loop === undefined)
                loop = false

            if(!loop)
              serverQueue.songs.shift();

            module.exports.play(guild, serverQueue.songs[0]);
          })
          .on("error", error => console.log("In Error"));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

        loop = await module.exports.getLoop(guild)
        if(loop === undefined)
            loop = false
        if(!loop)
          serverQueue.textChannel.send(`Start playing: **${song.title}**`);
      },

      pause : function(message)
      {
          try
          {
            serverQueue = queue.get(message.guild.id)
            serverQueue.connection.dispatcher.pause()
          } catch(err)
          {
              message.channel.send(err)
          }
          
      },

      resume : function(message)
      {
          try
          {
            serverQueue = queue.get(message.guild.id)
            serverQueue.connection.dispatcher.resume()
          } catch(err)
          {
              message.channel.send(err)
          }
          
      },

      setLoop : async (message) =>
      {
          dbo = db.getDb()
          loop = await module.exports.getLoop(message.guild)
          if(!loop)
          {
              dbo.collection("servers").updateOne({id: message.guild.id}, {$set:{"loop":true}})
              message.channel.send("Loop is enabled")
          }
          else 
          {
              dbo.collection("servers").updateOne({id: message.guild.id}, {$set: {"loop":false}})
              message.channel.send("Loop is disabled")
          }

      },

      getLoop : async function(guild) 
      {
          dbo = db.getDb()
          result = await dbo.collection("servers").findOne({id: guild.id})
          if(result.loop === undefined)
          {
              dbo.collection("servers").updateOne({id: guild.id}, {$set: {loop:false}})
          }

          return result.loop
      },

      restart : (message) =>
      {
          try
          {
              serverQueue = queue.get(message.guild.id)
              module.exports.execute(message, serverQueue.songs[0].url).then(() =>
              {
                  serverQueue.connection.dispatcher.end()
              })
          } catch(err)
          {
              message.channel.send(err)
          }
          
      }
}
