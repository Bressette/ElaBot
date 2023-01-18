"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var youtubedl = require('youtube-dl-exec');
var ytpl = require('ytpl');
var search = require('ytsr');
var getLoop = require('../../util/getLoop');
var printQueue = require('./queue');
var isUrl = require("../../util/isUrl");
var stream = require('stream');
var _a = require("@discordjs/voice"), joinVoiceChannel = _a.joinVoiceChannel, createAudioPlayer = _a.createAudioPlayer, NoSubscriberBehavior = _a.NoSubscriberBehavior, createAudioResource = _a.createAudioResource, AudioResource = _a.AudioResource, demuxProbe = _a.demuxProbe, AudioPlayerStatus = _a.AudioPlayerStatus, AudioPlayerState = _a.AudioPlayerState, AudioPlayerPausedState = _a.AudioPlayerPausedState;
var fs = require("fs");
var Module = require("module");
var player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
    }
});
module.exports =
    {
        name: "play",
        description: "Searches and plays a song from youtube",
        aliases: ['p'],
        execute: function (message, args) {
            return __awaiter(this, void 0, void 0, function () {
                var serverQueue, searchKeywords, voiceChannel, permissions, songInfo, song, queueContruct, guild_1, connection, err_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            serverQueue = message.client.queue.get(message.guild.id);
                            if (args.length === 0 && serverQueue.audioPlayer.state.status.includes("paused")) {
                                return [2 /*return*/, serverQueue.audioPlayer.resume()];
                            }
                            searchKeywords = message.content.substr(message.content.indexOf(args[0]));
                            voiceChannel = message.member.voice.channel;
                            //check that the user is in a voice channel and the bot has the permissions to connect and speak
                            if (!voiceChannel)
                                return [2 /*return*/, message.channel.send("You need to be in a voice channel to play music!")];
                            permissions = voiceChannel.permissionsFor(message.client.user);
                            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                                return [2 /*return*/, message.channel.send("I need the permissions to join and speak in your voice channel!")];
                            }
                            return [4 /*yield*/, module.exports.getSongInfo(message, searchKeywords)
                                //creates an object to store the song details
                            ];
                        case 1:
                            songInfo = _a.sent();
                            song = {
                                title: songInfo.title,
                                url: songInfo.url
                            };
                            if (!!serverQueue) return [3 /*break*/, 6];
                            queueContruct = {
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
                            guild_1 = message.guild;
                            player.on(AudioPlayerStatus.Idle, function () { return __awaiter(_this, void 0, void 0, function () {
                                var serverQueue, loop;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            serverQueue = message.client.queue.get(guild_1.id);
                                            if (!(serverQueue === null || serverQueue === void 0 ? void 0 : serverQueue.connection)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, getLoop.execute(guild_1)
                                                //if loop isn't enabled shift the queue to get the next song
                                            ];
                                        case 1:
                                            loop = _a.sent();
                                            //if loop isn't enabled shift the queue to get the next song
                                            if (!loop)
                                                serverQueue.songs.shift();
                                            //call play recursively to play the next song
                                            return [4 /*yield*/, module.exports.play(message, guild_1, serverQueue.songs[0])];
                                        case 2:
                                            //call play recursively to play the next song
                                            _a.sent();
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); });
                            player.on('error', function (error) {
                                console.error("Error: ".concat(error.message, " playing resource"));
                            });
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            connection = joinVoiceChannel({
                                channelId: voiceChannel.id,
                                guildId: voiceChannel.guild.id,
                                adapterCreator: voiceChannel.guild.voiceAdapterCreator
                            });
                            connection.subscribe(player);
                            queueContruct.connection = connection;
                            queueContruct.audioPlayer = player;
                            return [4 /*yield*/, module.exports.play(message, message.guild, queueContruct.songs[0])];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            err_1 = _a.sent();
                            console.log(err_1);
                            console.error(err_1);
                            message.client.queue.delete(message.guild.id);
                            return [2 /*return*/, message.channel.send(err_1)];
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            serverQueue.songs.push(song);
                            message.channel.send("".concat(song.title, " has been added to the queue!"));
                            printQueue.execute(message, args);
                            _a.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        },
        play: function (message, guild, song) {
            return __awaiter(this, void 0, void 0, function () {
                var serverQueue, resource;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            serverQueue = message.client.queue.get(guild.id);
                            //if there is no song delete the queue and leave the voice channel
                            if (!song) {
                                console.log("Song is not defined. Destroying the AudioPlayerConnection for guild: " + guild.id);
                                serverQueue.connection.destroy();
                                message.client.queue.delete(guild.id);
                                return [2 /*return*/];
                            }
                            //create the dispatcher to play the audio in the voice channel
                            console.log("Begin playing song: " + song.title);
                            return [4 /*yield*/, module.exports.createDiscordAudioResource(song.url)];
                        case 1:
                            resource = _a.sent();
                            player.play(resource);
                            serverQueue.textChannel.send("Start playing: **".concat(song.title, "**"));
                            return [2 /*return*/];
                    }
                });
            });
        },
        //method that is used to get the song title and url 
        getSongInfo: function (message, searchKeywords) {
            return __awaiter(this, void 0, void 0, function () {
                var videoDetails, options, values, error_1, videos, _i, videos_1, i, videoDetails, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!isUrl.execute(searchKeywords)) return [3 /*break*/, 2];
                            return [4 /*yield*/, youtubedl(searchKeywords, {
                                    dumpSingleJson: true
                                })];
                        case 1:
                            videoDetails = _a.sent();
                            if (videoDetails === null || videoDetails === void 0 ? void 0 : videoDetails.title) {
                                return [2 /*return*/, { title: videoDetails.title, url: videoDetails.webpage_url }];
                            }
                            _a.label = 2;
                        case 2:
                            options = { pages: 1 } //limit the search results to 10 videos
                            ;
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, search(searchKeywords, options)]; //store the search results in values
                        case 4:
                            values = _a.sent(); //store the search results in values
                            return [3 /*break*/, 6];
                        case 5:
                            error_1 = _a.sent();
                            console.log(error_1);
                            message.channel.send("Could not find a youtube video for those search terms");
                            return [2 /*return*/];
                        case 6:
                            videos = values.items.filter(function (value) { return value.url !== undefined || value.type !== "playlist"
                                || value.type !== "channel" || value.type !== "movie"; });
                            if (!(videos.length !== 0)) return [3 /*break*/, 13];
                            _i = 0, videos_1 = videos;
                            _a.label = 7;
                        case 7:
                            if (!(_i < videos_1.length)) return [3 /*break*/, 12];
                            i = videos_1[_i];
                            _a.label = 8;
                        case 8:
                            _a.trys.push([8, 10, , 11]);
                            return [4 /*yield*/, youtubedl(i.url, {
                                    dumpSingleJson: true
                                })];
                        case 9:
                            videoDetails = _a.sent();
                            return [2 /*return*/, { title: videoDetails.title, url: videoDetails.webpage_url }];
                        case 10:
                            err_2 = _a.sent();
                            console.error(err_2);
                            return [3 /*break*/, 11];
                        case 11:
                            _i++;
                            return [3 /*break*/, 7];
                        case 12: return [2 /*return*/, message.channel.send("Could not find a playable video for those search terms")];
                        case 13: return [2 /*return*/, message.channel.send("That video does not exist!")];
                    }
                });
            });
        },
        createDiscordAudioResource: function (url) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var process = youtubedl.exec(url, {
                                o: '-',
                                q: '',
                                f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio'
                            }, { stdio: ['ignore', 'pipe', 'ignore'] });
                            if (!process.stdout) {
                                reject(new Error('No stdout'));
                                return;
                            }
                            var stream = process.stdout;
                            var onError = function (error) {
                                if (!process.killed)
                                    process.kill();
                                stream.resume();
                                reject(error);
                            };
                            process
                                .once('spawn', function () {
                                demuxProbe(stream)
                                    .then(function (probe) { return resolve(createAudioResource(probe.stream, { metadata: _this, inputType: probe.type })); })
                                    .catch(onError);
                            })
                                .catch(onError);
                        })];
                });
            });
        }
    };
