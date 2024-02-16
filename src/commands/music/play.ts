import * as youtubedl from 'youtube-dl-exec'
import * as search from 'ytsr'
import {GetLoop as getLoop} from "../../util/getLoop.js";
import {Queue as printQueue} from "./queue.js";
import {IsUrl as isUrl} from "../../util/isUrl.js";
import {joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, demuxProbe, AudioPlayerStatus} from '@discordjs/voice';

const player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
    }
});

export class Play
{
    static commandName = "play";
    static description = "Searches and plays a song from youtube";
    static aliases = ['p'];


    static async execute(message, args)
    {
        const serverQueue = message.client.queue.get(message.guild.id)
        if(args.length === 0 && serverQueue.audioPlayer.state.status.includes("paused")) {
            return serverQueue.audioPlayer.resume();
        }

        const searchKeywords = message.content.substr(message.content.indexOf(args[0]))
        //playing videos from a playlist(Currently WIP)
        // if(args.length === 1 && searchKeywords.includes("playlist?list=")) {
        //     playlistId = searchKeywords.split("list=")[1]
        //     console.log(playlistId)
        //     console.log(await ytpl(playlistId))
        // }

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
        const songInfo = await module.exports.getSongInfo(message, searchKeywords)
        
        //creates an object to store the song details
        const song = {
          title: songInfo.title,
          url: songInfo.url
        };
      
        //if there are no songs in the queue create a new queue object
        if (!serverQueue) {
          const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            audioPlayer: null,
            songs: [],
            volume: 5,
            playing: true
          };
      
          //set the queue for the guild and push a song into the queue
          message.client.queue.set(message.guild.id, queueContruct);
          queueContruct.songs.push(song);
          const guild = message.guild;

          player.on(AudioPlayerStatus.Idle, async() => {
              const serverQueue = message.client.queue.get(guild.id);
              if(serverQueue?.connection) {
                  //check if the current song should loop
                  const loop = await getLoop.execute(guild)

                  //if loop isn't enabled shift the queue to get the next song
                  if(!loop)
                      serverQueue.songs.shift();
                  //call play recursively to play the next song
                  await module.exports.play(message, guild, serverQueue.songs[0]);
              }
            });
            player.on('error', error => {
                console.error(`Error: ${error.message} playing resource`);
            })
      
          //try to join the voiceChannel and play the song if an exception occurs the queue is deleted
          try {
              const connection = joinVoiceChannel({
                  channelId: voiceChannel.id,
                  guildId: voiceChannel.guild.id,
                  adapterCreator: voiceChannel.guild.voiceAdapterCreator
              });
              connection.subscribe(player);
              queueContruct.connection = connection;
              queueContruct.audioPlayer = player;
              await module.exports.play(message, message.guild, queueContruct.songs[0]);
          } catch (err) {
              console.log(err);
              console.error(err);
              message.client.queue.delete(message.guild.id);
              return message.channel.send(err);
          }
        }
        else {
            serverQueue.songs.push(song);
            message.channel.send(`${song.title} has been added to the queue!`);
            printQueue.execute(message, args)
        }
    }

    async play(message, guild, song)
    {
        const serverQueue = message.client.queue.get(guild.id);
        //if there is no song delete the queue and leave the voice channel
        if (!song) {
            console.log("Song is not defined. Destroying the AudioPlayerConnection for guild: " + guild.id);
            serverQueue.connection.destroy();
            message.client.queue.delete(guild.id);
            return;
        }
        //create the dispatcher to play the audio in the voice channel
        console.log("Begin playing song: " + song.title);
        const resource = await module.exports.createDiscordAudioResource(song.url);
        player.play(resource);
        serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    }

    //method that is used to get the song title and url 
    async getSongInfo(message, searchKeywords) {
        if(isUrl.execute(searchKeywords)) {
            const videoDetails = await youtubedl.default(searchKeywords, {
                dumpSingleJson: true
            });
            if(videoDetails?.title) {
                return {title: videoDetails.title, url: videoDetails.webpage_url};
            }
        }
        const options = {pages: 1} //limit the search results to 10 videos
        let values
        try {
            values = await search(searchKeywords, options) //store the search results in values
        } catch(error) {
            console.log(error)
            message.channel.send("Could not find a youtube video for those search terms");
            return;
        }

        const videos = values.items.filter(value => value.url !== undefined || value.type !== "playlist"
            || value.type !== "channel" || value.type !== "movie")
        //if the search result is not empty remove results that cannot be played and return the song info for the link that can be played
        if(videos.length !== 0) {
            //loop that iterates over the search results until a video that can be played is found.
            for(const i of videos) {
                try {
                    const videoDetails = await youtubedl.default(i.url, {
                        dumpSingleJson: true
                    });
                    return {title: videoDetails.title, url: videoDetails.webpage_url};
                } catch(err) {
                    console.error(err)
                }
            }
            return message.channel.send("Could not find a playable video for those search terms");
        }
        else {
            return message.channel.send("That video does not exist!");
        }
    }

    async createDiscordAudioResource(url) {
        return new Promise((resolve, reject) => {
            const process = youtubedl.exec(
                url
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
