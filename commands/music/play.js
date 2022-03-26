const ytdl = require('ytdl-core')
const youtubedl = require('youtube-dl-exec')
const ytpl = require('ytpl')
const search = require('ytsr')
const db = require('./../../util/mongoUtil')
const getLoop = require('./../../util/getLoop')
const printQueue = require('./queue')
const stream = require('stream')
const {joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioResource, demuxProbe, AudioPlayerStatus} = require("@discordjs/voice");
const fs = require("fs");
const Module = require("module");

const player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
    }
});

module.exports = 
{
    name: "play",
    description: "Searches and plays a song from youtube",
    aliases: ['p'],


    async execute(message, args)
    {
        serverQueue = message.client.queue.get(message.guild.id)
        if(args.length === 0 && serverQueue.connection.dispatcher.paused)
        {
            return serverQueue.connection.dispatcher.resume()
        }

        searchKeywords = message.content.substr(message.content.indexOf(args[0]))
        if(args.length === 1 && searchKeywords.includes("playlist?list=")) {
            playlistId = searchKeywords.split("list=")[1]
            console.log(playlistId)
            console.log(await ytpl(playlistId))
        }

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

        let songInfo
        if(ytdl.validateURL(searchKeywords)) {
            songInfo = await ytdl.getInfo(searchKeywords)
            console.log(songInfo)
            console.log(songInfo.videoDetails.video_url)
        }
        else {
            //gets the song info(title and video url) from the first applicable result
            songInfo = await module.exports.getSongInfo(message, searchKeywords)
        }
        
        //creates an object to store the song details
        const song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url
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
              const connection = joinVoiceChannel({
                  channelId: voiceChannel.id,
                  guildId: voiceChannel.guild.id,
                  adapterCreator: voiceChannel.guild.voiceAdapterCreator
              });
              connection.subscribe(player);
              queueContruct.connection = connection;
              await module.exports.play(message, message.guild, queueContruct.songs[0]);
          } catch (err) {
              console.log(err);
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
            console.log("In !song")
            serverQueue.connection.destroy();
            message.client.queue.delete(guild.id);
            return;
        }
        //create the dispatcher to play the audio in the voice channel
        console.log("About to play the audio")
        // const testYtDl = await youtubedl(song.url,
        //     {
        //         o: '-',
        //         q: '',
        //         f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
        //         r: '100K',
        //     }, { stdio: ['ignore', 'pipe', 'ignore'] });
        // const audioStream = new stream.PassThrough();
        // const testYtDl = await youtubedl.raw(song.url, {
        //     dumpSingleJson: true,
        //     noWarnings: true,
        //     noCallHome: true,
        //     noCheckCertificate: true,
        //     preferFreeFormats: true,
        //     youtubeSkipDashManifest: true,
        //     referer: 'https://www.youtube.com/watch?v=6xKWiCMKKJg'
        // });
        // const getYtDlInfo = await youtubedl(song.url, {dumpSingleJson: true});
        // const testYtDl = youtubedl.exec(song.url, {dumpJson: true});
        // testYtDl.stdout.pipe(fs.createWriteStream('stdout.txt'));
        const resource = await module.exports.createDiscordAudioResource(song.url);
        player.play(resource);
        player.on(AudioPlayerStatus.Idle, async() => {
            //check if the current song should loop
            loop = await getLoop.execute(guild)
            if(loop === undefined)
                loop = false

            //if loop isn't enabled shift the queue to get the next song
            if(!loop)
              serverQueue.songs.shift();

            //call play recursively to play the next song
            await module.exports.play(message, guild, serverQueue.songs[0]);
        });
        player.on('error', error => {
            console.error(`Error: ${error.message} playing resource`);
        })
        serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    },

    //method that is used to get the song title and url 
    async getSongInfo(message, searchKeywords) {
        options = {pages: 1} //limit the search results to 10 videos
        let values

        try {
            values = await search(searchKeywords, options) //store the search results in values
        } catch(error) {
            console.log(error)
            return await ytdl.getInfo("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
        }
        
        //if the search result is not empty remove results that cannot be played and return the song info for the link that can be played
        if(values.items.length != 0)
        {
            i = 0
            while(values.items[i].url === undefined || values.items[i].type === "playlist" || values.items[i].type === "channel" || values.items[i].type === "movie")
            {
                i++
            }

            //loop that iterates over the search results until a video that can be played is found.
            while(true)
            {
                try {
                    return await ytdl.getInfo(values.items[i].url)
                } catch(err) {
                    console.error(err)
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
    },

    async createDiscordAudioResource(url) {
        return new Promise((resolve, reject) => {
            const process = youtubedl.exec(
                url,
                {
                    o: '-',
                    q: '',
                    f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
                    r: '100K',
                },
                { stdio: ['ignore', 'pipe', 'ignore'] },
            );
            if (!process.stdout) {
                reject(new Error('No stdout'));
                return;
            }
            const stream = process.stdout;
            const onError = error => {
                if (!process.killed) process.kill();
                stream.resume();
                reject(error);
            };
            process
                .once('spawn', () => {
                    demuxProbe(stream)
                        .then(probe => resolve(createAudioResource(probe.stream, { metadata: this, inputType: probe.type })))
                        .catch(onError);
                })
                .catch(onError);
        });
    }
}
