const ytdl = require('ytdl-core')
const search = require('youtube-search')
const config = require('./config.json')

var opts = 
{
    maxResults: 10,
    key: config.googlekey
}

const queue = new Map()

module.exports =
{
    execute : async function(message, content) {
      let results
      if(content.startsWith("play"))
          searchKeywords = content.substr(4, content.length).trim()
      else
          searchKeywords = content.substr(1, content.length).trim()

      module.exports.search(searchKeywords, async function(results, index)
      {

        serverQueue = queue.get(message.guild.id)
      
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
        if(index === -1)
            link = results
        else
        {
            link = results[index].link
        }

        console.log(`The value of link is ${link}`)
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
      })
    },

      search : async function(searchKeywords, returnFunction)
      {
          if(!searchKeywords.includes("http"))
          {
            console.log("Before search")
            search(searchKeywords, opts, function(err, results) 
            {
                if(err) return console.log("This is an error\n" + err)
                i = 0
                while(results[i].link.includes("channel") || results[i].link.includes("list="))
                {
                    i++
                }

                returnFunction(results, i)
            })
          }
          else
          {
              returnFunction(searchKeywords, -1)
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
          .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`Start playing: **${song.title}**`);
      }
}
