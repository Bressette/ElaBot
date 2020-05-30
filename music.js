const ytdl = require('ytdl-core')
const search = require('ytsr')

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

        let link
        if(ytdl.validateURL(searchKeywords))
            link = searchKeywords
        else
        {
            options = {limit: 5}
            values = await search(searchKeywords, options)
            i = 0
            while(values.items[i].link.includes("list=") || values.items[i].link.includes("/channel/"))
            {
                i++
            }
    
            link = values.items[i].link
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
        } else {
          serverQueue.songs.push(song);
          return message.channel.send(`${song.title} has been added to the queue!`);
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
      
      play : function(guild, song) {
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
            module.exports.play(guild, serverQueue.songs[0]);
          })
          .on("error", error => console.log("In Error"));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`Start playing: **${song.title}**`);
      },

      pause : function(message)
      {
          serverQueue = queue.get(message.guild.id)
          serverQueue.connection.dispatcher.pause()
      },

      resume : function(message)
      {
          serverQueue = queue.get(message.guild.id)
          serverQueue.connection.dispatcher.resume()
      }
}
