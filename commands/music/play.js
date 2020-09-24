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

        searchKeywords = content.substr(content.indexOf(args[0]), content.length)


        const voiceChannel = message.member.voice.channel; //initialize a voiceChannel object to join the voice channel

        //check that the user is in a voice channel and the bot has the permissions to connect and speak
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

        //gets the song info(title and video url) from the first applicable result
        songInfo = await module.exports.getSongInfo(message, searchKeywords)
        
        //creates an object to store the song details
        const song = {
          title: songInfo.title,
          url: songInfo.video_url
        };
      
        //if there are no songs in the queue create a new queue object
        if (!serverQueue) 
        {
          const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
          };
      
          //set the queue for the guild and push a song into the queue
          message.client.queue.set(message.guild.id, queueContruct);
          queueContruct.songs.push(song);
      
          //try to join the voiceChannel and play the song if an exception occurs the queue is deleted
          try {
              var connection = await voiceChannel.join();
              queueContruct.connection = connection;
              module.exports.play(message, message.guild, queueContruct.songs[0]);
          } catch (err) {
              console.error(err);
              message.client.queue.delete(message.guild.id);
              return message.channel.send(err);
          }
        }
        else 
        {
            serverQueue.songs.push(song);
            message.channel.send(`${song.title} has been added to the queue!`);
            printQueue.execute(message, args)
        }
    },

    async play(message, guild, song)
    {
        const serverQueue = message.client.queue.get(guild.id);
        //if there is no song delete the queue and leave the voice channel
        if (!song) {
            serverQueue.voiceChannel.leave();
            message.client.queue.delete(guild.id);
            return;
        }

        //create the dispatcher to play the audio in the voice channel
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on("finish", async() => {

                //check if the current song should loop
                loop = await getLoop.execute(guild)
                if(loop === undefined)
                    loop = false

                //if loop isn't enabled shift the queue to get the next song
                if(!loop)
                  serverQueue.songs.shift();

                //call play recursively to play the next song
                module.exports.play(message, guild, serverQueue.songs[0]);
          })
          .on("error", error => console.error(error));

        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5); //sets the volume to 1/5 of the max on the first execution
        serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    },

    //method that is used to get the song title and url 
    async getSongInfo(message, searchKeywords) {

        //if the message contains a valid url return the associated info object
        if(ytdl.validateURL(searchKeywords))
            return await ytdl.getInfo(searchKeywords)
        
        //if the user did not provide a valid url search for a video with the given string
        else
        {
            options = {limit: 10} //limit the search results to 10 videos
            values = await search(searchKeywords, options) //store the search results in values
            
            //if the search result is not empty remove results that cannot be played and return the song info for the link that can be played
            if(values.items.length != 0)
            {
                i = 0
                while(values.items[i].type === "playlist" || values.items[i].type === "channel" || values.items[i].link === undefined || values.items[i].type === "movie")
                {
                    i++
                }

                //loop that iterates over the search results until a video that can be played is found.
                while(true)
                {
                    let songInfo
                    try {
                        songInfo = await ytdl.getInfo(values.items[i].link)
                        return songInfo
                    } catch(err) {
                        console.error(err)
                        console.log(i)
                        if(i > 9)
                            return await ytdl.getInfo("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                        else
                            i++
                    }
                }
            }
            else
            {
                message.channel.send("That video does not exist!")
                return await ytdl.getInfo("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            }
        }
    }
}