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
var mongoUtil_1 = require("../../util/mongoUtil");
var logger_1 = require("../../logger");
var getMention = require("../../util/getMention");
var getMessages = require("../../util/getMessages");
var isUrl = require("../../util/isUrl");
function fetchChannelsByServerId(serverId, client) {
    return __awaiter(this, void 0, void 0, function () {
        var guild;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.guilds.fetch(serverId)];
                case 1:
                    guild = _a.sent();
                    return [4 /*yield*/, guild.channels.fetch()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function fetchRolesByServerId(serverId, client) {
    return __awaiter(this, void 0, void 0, function () {
        var guild;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.guilds.fetch(serverId)];
                case 1:
                    guild = _a.sent();
                    return [4 /*yield*/, guild.roles.fetch()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function fetchServers(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.guilds.fetch()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function fetchServerIconLink(client, serverId) {
    return __awaiter(this, void 0, void 0, function () {
        var guild;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.guilds.fetch(serverId)];
                case 1:
                    guild = _a.sent();
                    return [2 /*return*/, guild.iconURL({ dynamic: true })];
            }
        });
    });
}
function fetchServerById(client, serverId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.guilds.fetch(serverId)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function postMessage(client, serverId, channelId, message) {
    return __awaiter(this, void 0, void 0, function () {
        var guild, channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.guilds.fetch(serverId)];
                case 1:
                    guild = _a.sent();
                    return [4 /*yield*/, guild.channels.fetch(channelId)];
                case 2:
                    channel = _a.sent();
                    return [4 /*yield*/, channel.send(message)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function fetchServerMessagesByChannelId(serverId, channelId, messageCount) {
    return __awaiter(this, void 0, void 0, function () {
        var dbo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dbo = mongoUtil_1.MongoUtil.getDb();
                    return [4 /*yield*/, dbo.collection("messages").find({ channelId: channelId, guildId: serverId }, { limit: parseInt(messageCount) }).toArray()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function copyServerContents(sourceGuildId, targetGuildId, client) {
    return __awaiter(this, void 0, void 0, function () {
        var channels, _a, _b, targetGuild, guildCategory, _i, channels_1, i, currentChannel, fetchedMessages, _c, fetchedMessages_1, j, x, y, tempString, mention, messageToSend, _d, _e, k;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _b = (_a = Array).from;
                    return [4 /*yield*/, fetchChannelsByServerId(sourceGuildId, client)];
                case 1:
                    channels = _b.apply(_a, [_f.sent()]);
                    return [4 /*yield*/, client.guilds.fetch(targetGuildId)];
                case 2:
                    targetGuild = _f.sent();
                    return [4 /*yield*/, targetGuild.channels.create(channels[0][1].guild.name, { type: "GUILD_CATEGORY" })];
                case 3:
                    guildCategory = _f.sent();
                    _i = 0, channels_1 = channels;
                    _f.label = 4;
                case 4:
                    if (!(_i < channels_1.length)) return [3 /*break*/, 15];
                    i = channels_1[_i];
                    if (!(i[1].type === "GUILD_TEXT")) return [3 /*break*/, 14];
                    if (!(i[1].name !== "general")) return [3 /*break*/, 14];
                    return [4 /*yield*/, targetGuild.channels.create(i[1].name, { type: "GUILD_TEXT", parent: guildCategory })];
                case 5:
                    currentChannel = _f.sent();
                    return [4 /*yield*/, fetchServerMessagesByChannelId(sourceGuildId, i[1].id, 100000)];
                case 6:
                    fetchedMessages = (_f.sent()).sort(function (a, b) {
                        // @ts-ignore
                        return new Date(a.createdTimestamp) - new Date(b.createdTimestamp);
                    });
                    _c = 0, fetchedMessages_1 = fetchedMessages;
                    _f.label = 7;
                case 7:
                    if (!(_c < fetchedMessages_1.length)) return [3 /*break*/, 14];
                    j = fetchedMessages_1[_c];
                    console.log("send messages here");
                    if (!(j.content.length > 0)) return [3 /*break*/, 9];
                    for (x = 0; x < j.content.length; x++) {
                        for (y = x; y < j.content.length; y++) {
                            tempString = j.content.substring(x, y + 1);
                            mention = getMention.execute(tempString);
                            if (mention) {
                                j.content = j.content.replace(mention, "");
                            }
                        }
                    }
                    messageToSend = "".concat(j.authorUsername, "#").concat(j.authorDiscriminator, " on ").concat(new Date(j.createdTimestamp).toDateString(), " | ").concat(j.content);
                    messageToSend = messageToSend.substring(0, 2000);
                    return [4 /*yield*/, currentChannel.send(messageToSend)];
                case 8:
                    _f.sent();
                    _f.label = 9;
                case 9:
                    if (!(j.attachments.length > 0)) return [3 /*break*/, 13];
                    _d = 0, _e = j.attachments;
                    _f.label = 10;
                case 10:
                    if (!(_d < _e.length)) return [3 /*break*/, 13];
                    k = _e[_d];
                    return [4 /*yield*/, currentChannel.send("".concat(j.authorUsername, "#").concat(j.authorDiscriminator, " on ").concat(new Date(j.createdTimestamp).toDateString(), " | ").concat(k))];
                case 11:
                    _f.sent();
                    _f.label = 12;
                case 12:
                    _d++;
                    return [3 /*break*/, 10];
                case 13:
                    _c++;
                    return [3 /*break*/, 7];
                case 14:
                    _i++;
                    return [3 /*break*/, 4];
                case 15: return [2 /*return*/];
            }
        });
    });
}
function fetchMembersByServerId(client, serverId) {
    return __awaiter(this, void 0, void 0, function () {
        var guild;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.guilds.fetch(serverId)];
                case 1:
                    guild = _a.sent();
                    return [4 /*yield*/, guild.members.fetch()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function fetchUsersByServerId(client, serverId) {
    return __awaiter(this, void 0, void 0, function () {
        var guild, guildMembers, _a, _b, users, _i, guildMembers_1, i, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, client.guilds.fetch(serverId)];
                case 1:
                    guild = _e.sent();
                    _b = (_a = Array).from;
                    return [4 /*yield*/, guild.members.fetch()];
                case 2:
                    guildMembers = _b.apply(_a, [_e.sent()]);
                    users = [];
                    _i = 0, guildMembers_1 = guildMembers;
                    _e.label = 3;
                case 3:
                    if (!(_i < guildMembers_1.length)) return [3 /*break*/, 6];
                    i = guildMembers_1[_i];
                    _d = (_c = users).push;
                    return [4 /*yield*/, i[1].user.fetch()];
                case 4:
                    _d.apply(_c, [_e.sent()]);
                    _e.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/, users];
            }
        });
    });
}
function fetchEmojisByServerId(client, serverId) {
    return __awaiter(this, void 0, void 0, function () {
        var guild;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.guilds.fetch(serverId)];
                case 1:
                    guild = _a.sent();
                    return [4 /*yield*/, guild.emojis.fetch()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function fetchStickersByServerId(client, serverId) {
    return __awaiter(this, void 0, void 0, function () {
        var guild;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.guilds.fetch(serverId)];
                case 1:
                    guild = _a.sent();
                    return [4 /*yield*/, guild.stickers.fetch()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function storeServerContents(client, serverId) {
    return __awaiter(this, void 0, void 0, function () {
        var guild, guildMembers, channels, roles, emojis;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.guilds.fetch(serverId)];
                case 1:
                    guild = _a.sent();
                    return [4 /*yield*/, storeGuild(guild)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, guild.members.fetch()];
                case 3:
                    guildMembers = _a.sent();
                    return [4 /*yield*/, storeGuildMembers(guildMembers)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, guild.channels.fetch()];
                case 5:
                    channels = _a.sent();
                    return [4 /*yield*/, storeGuildChannels(channels)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, guild.roles.fetch()];
                case 7:
                    roles = _a.sent();
                    return [4 /*yield*/, storeGuildRoles(roles)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, guild.emojis.fetch()];
                case 9:
                    emojis = _a.sent();
                    return [4 /*yield*/, storeEmojis(emojis)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, storeMessages(guild)];
                case 11:
                    _a.sent();
                    logger_1.logger.info("Finished saving data for guild: ".concat(guild.id));
                    return [2 /*return*/, true];
            }
        });
    });
}
function storeGuild(guild) {
    return __awaiter(this, void 0, void 0, function () {
        var guildModel, guildMembers, guildChannels, guildRoles, emojis, dbo, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    guildModel = {};
                    //setting guild properties to store in MongoDB
                    guildModel._id = guild.id;
                    guildModel.name = guild.name;
                    guildModel.icon = guild.icon;
                    guildModel.features = guild.features;
                    return [4 /*yield*/, guild.members.fetch()];
                case 1:
                    guildMembers = _a.sent();
                    guildModel.members = [];
                    guildMembers.forEach(function (value, key) { return guildModel.members.push(value.id); });
                    return [4 /*yield*/, guild.channels.fetch()];
                case 2:
                    guildChannels = _a.sent();
                    guildModel.channels = [];
                    guildChannels.forEach(function (value, key) { return guildModel.channels.push(value.id); });
                    return [4 /*yield*/, guild.roles.fetch()];
                case 3:
                    guildRoles = _a.sent();
                    guildModel.roles = [];
                    // add guild roles
                    guildRoles.forEach(function (value, key) {
                        guildModel.roles.push(value.id);
                    });
                    guildModel.splash = guild.splash;
                    guildModel.verificationLevel = guild.verificationLevel;
                    guildModel.nsfwLevel = guild.nsfwLevel;
                    guildModel.memberCount = guild.memberCount;
                    guildModel.afkTimeout = guild.afkTimeout;
                    guildModel.afkChannelId = guild.afkChannelId;
                    guildModel.systemChannelId = guild.systemChannelId;
                    guildModel.premiumTier = guild.premiumTier;
                    guildModel.premiumSubscriptionCount = guild.premiumSubscriptionCount;
                    guildModel.explicitContentFilter = guild.explicitContentFilter;
                    guildModel.joinedTimestamp = guild.joinedTimestamp;
                    guildModel.defaultMessageNotifications = guild.defaultMessageNotifications;
                    guildModel.maximumMembers = guild.maximumMembers;
                    guildModel.maximumPresences = guild.maximumPresences;
                    guildModel.preferredLocale = guild.preferredLocale;
                    guildModel.ownerId = guild.ownerId;
                    return [4 /*yield*/, guild.emojis.fetch()];
                case 4:
                    emojis = _a.sent();
                    guildModel.emojis = [];
                    emojis.forEach(function (value, key) { return guildModel.emojis.push(value.id); });
                    guildModel.nameAcronym = guild.nameAcronym;
                    guildModel.splashURL = guild.splashURL();
                    guildModel.bannerURL = guild.bannerURL();
                    guildModel.discoverySplashURL = guild.discoverySplashURL();
                    dbo = mongoUtil_1.MongoUtil.getDb();
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, dbo.collection("guild").insertOne(guildModel)];
                case 6:
                    result = _a.sent();
                    if (result === null || result === undefined) {
                        logger_1.logger.error("Guild insert was unsuccessful");
                    }
                    else {
                        logger_1.logger.info("Inserted Guild: {".concat(guildModel.name, ", ").concat(guildModel._id));
                    }
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    logger_1.logger.error("Guild insert was unsuccessful: " + JSON.stringify(err_1));
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function storeGuildMembers(guildMembers) {
    return __awaiter(this, void 0, void 0, function () {
        var guildMembersModels, userModels, dbo, result, err_2, result, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    guildMembersModels = [];
                    userModels = [];
                    guildMembers.forEach(function (value, key) {
                        var guildMemberModel = {};
                        guildMemberModel.guildId = value.guild.id;
                        var roles = value.roles.cache;
                        guildMemberModel.roles = [];
                        roles.forEach(function (role, key) { return guildMemberModel.roles.push(role.id); });
                        guildMemberModel.deleted = value.deleted;
                        guildMemberModel.joinedTimestamp = value.joinedTimestamp;
                        guildMemberModel.nickname = value.nickname;
                        guildMemberModel.displayName = value.displayName;
                        guildMemberModel.pending = value.pending;
                        guildMemberModel.premiumSinceTimestamp = value.premiumSinceTimestamp;
                        guildMemberModel.userId = value.user.id;
                        var userModel = {};
                        userModel._id = value.user.id;
                        userModel.bot = value.user.bot;
                        userModel.tag = value.user.tag;
                        userModel.createdTimestamp = value.user.createdTimestamp;
                        userModel.avatar = value.user.avatar;
                        userModel.avatarURL = value.user.avatarURL();
                        userModel.defaultAvatarURL = value.user.defaultAvatarURL;
                        userModel.discriminator = value.user.discriminator;
                        userModel.system = value.user.system;
                        userModel.username = value.user.username;
                        userModels.push(userModel);
                        guildMembersModels.push(guildMemberModel);
                    });
                    dbo = mongoUtil_1.MongoUtil.getDb();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dbo.collection("guildmember").insertMany(guildMembersModels, { ordered: false })];
                case 2:
                    result = _a.sent();
                    if (result === null || result === undefined) {
                        logger_1.logger.error("GuildMember insert was unsuccessful");
                    }
                    else {
                        logger_1.logger.info("Successfully inserted guild members");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    logger_1.logger.error("GuildMember insert was unsuccessful");
                    return [3 /*break*/, 4];
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, dbo.collection("user").insertMany(userModels, { ordered: false })];
                case 5:
                    result = _a.sent();
                    if (result === null || result === undefined) {
                        logger_1.logger.error("User insert was unsuccessful");
                    }
                    else {
                        logger_1.logger.info("Successfully inserted users");
                    }
                    return [3 /*break*/, 7];
                case 6:
                    err_3 = _a.sent();
                    logger_1.logger.error("User insert was unsuccessful");
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function storeGuildChannels(channels) {
    return __awaiter(this, void 0, void 0, function () {
        var channelModels, dbo, result, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    channelModels = [];
                    channels.forEach(function (value, key) {
                        var channelModel = {};
                        channelModel._id = value.id;
                        channelModel.name = value.name;
                        channelModel.deleted = value.deleted;
                        channelModel.createdTimestamp = value.createdTimestamp;
                        channelModel.type = value.type;
                        channelModel.guildId = value.guildId;
                        channelModel.parentId = value.parentId;
                        channelModel.rawPosition = value.rawPosition;
                        channelModels.push(channelModel);
                    });
                    dbo = mongoUtil_1.MongoUtil.getDb();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dbo.collection("channel").insertMany(channelModels, { ordered: false })];
                case 2:
                    result = _a.sent();
                    if (result === null || result === undefined) {
                        logger_1.logger.error("Channel insert was unsuccessful");
                    }
                    else {
                        logger_1.logger.error("Channel insert was successful");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _a.sent();
                    logger_1.logger.error("Channel insert was unsuccessful");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function storeGuildRoles(roles) {
    return __awaiter(this, void 0, void 0, function () {
        var roleModels, dbo, result, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roleModels = [];
                    roles.forEach(function (value) {
                        var roleModel = {};
                        roleModel.guild = value.guild.id;
                        roleModel._id = value.id;
                        roleModel.name = value.name;
                        roleModel.color = value.color;
                        roleModel.hoist = value.hoist;
                        roleModel.rawPosition = value.rawPosition;
                        roleModel.permissions = value.permissions.toArray();
                        roleModel.managed = value.managed;
                        roleModel.mentionable = value.mentionable;
                        roleModel.deleted = value.deleted;
                        roleModel.createdTimestamp = value.createdTimestamp;
                        roleModels.push(roleModel);
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    dbo = mongoUtil_1.MongoUtil.getDb();
                    return [4 /*yield*/, dbo.collection("role").insertMany(roleModels, { ordered: false })];
                case 2:
                    result = _a.sent();
                    if (result === null || result === undefined) {
                        logger_1.logger.error("Role insert was unsuccessful");
                    }
                    else {
                        logger_1.logger.error("Role insert was successful");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_5 = _a.sent();
                    logger_1.logger.error("Role insert was unsuccessful");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function storeEmojis(emojis) {
    return __awaiter(this, void 0, void 0, function () {
        var emojiModels, dbo, result, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    emojiModels = [];
                    emojis.forEach(function (value) {
                        var emojiModel = {};
                        emojiModel._id = value.id;
                        emojiModel.animated = value.animated;
                        emojiModel.name = value.name;
                        emojiModel.deleted = value.deleted;
                        emojiModel.guildId = value.guild.id;
                        emojiModel.requiresColons = value.requiresColons;
                        emojiModel.managed = value.managed;
                        emojiModel.available = value.available;
                        emojiModel.author = value.author.id;
                        emojiModel.createdTimestamp = value.createdTimestamp;
                        emojiModel.url = value.url;
                        emojiModel.identifier = value.identifier;
                        emojiModels.push(emojiModel);
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    dbo = mongoUtil_1.MongoUtil.getDb();
                    return [4 /*yield*/, dbo.collection("emoji").insertMany(emojiModels, { ordered: false })];
                case 2:
                    result = _a.sent();
                    if (result === null || result === undefined) {
                        logger_1.logger.error("Emoji insert was unsuccessful");
                    }
                    else {
                        logger_1.logger.error("Emoji insert was successful");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_6 = _a.sent();
                    logger_1.logger.error("Emoji insert was unsuccessful");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function storeMessages(guild) {
    return __awaiter(this, void 0, void 0, function () {
        var channels, allMessages, channelValues, channel, messages, _loop_1, _i, messages_1, i, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, guild.channels.fetch()];
                case 1:
                    channels = _a.sent();
                    allMessages = [];
                    channels = channels.filter((function (value) { return value.isText(); }));
                    channelValues = channels.values();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 12, , 13]);
                    channel = void 0;
                    _a.label = 3;
                case 3:
                    if (!!(channel = channelValues.next().value).done) return [3 /*break*/, 11];
                    logger_1.logger.info("Fetching messages for guild: ".concat(guild.id, ", channel: ").concat(channel.name));
                    return [4 /*yield*/, getMessages.execute(channel, 100000000)];
                case 4:
                    messages = _a.sent();
                    _loop_1 = function (i) {
                        var message, attachments_1, embeds_1, stickers, stickerIds;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    message = {};
                                    if (i[1].attachments.size > 0) {
                                        attachments_1 = [];
                                        i[1].attachments.forEach(function (value) {
                                            var attachment = {};
                                            attachment._id = value.id;
                                            attachment.height = value.height;
                                            attachment.contentType = value.contentType;
                                            attachment.name = value.name;
                                            attachment.proxyURL = value.proxyURL;
                                            attachment.size = value.size;
                                            attachment.spoiler = value.spoiler;
                                            attachment.url = value.url;
                                            attachment.width = value.width;
                                            attachments_1.push(attachment);
                                        });
                                        message.attachments = attachments_1;
                                    }
                                    if (i[1].embeds.size > 0) {
                                        embeds_1 = [];
                                        i[1].embeds.forEach(function (value) {
                                            var embed = {};
                                            embed.title = value.title;
                                            embed.description = value.description;
                                            embed.url = value.url;
                                            embed.color = value.color;
                                            embed.timestamp = value.timestamp;
                                            embed.thumbnail = value.thumbnail;
                                            embed.image = value.image;
                                            embed.video = value.video;
                                            embed.author = value.author;
                                            embed.provider = value.provider;
                                            embeds_1.push(embed);
                                        });
                                        message.embeds = embeds_1;
                                    }
                                    return [4 /*yield*/, i[1].stickers];
                                case 1:
                                    stickers = _b.sent();
                                    stickerIds = [];
                                    stickers.forEach(function (value) {
                                        stickerIds.push(value.id);
                                    });
                                    message.stickers = stickerIds;
                                    message.createdTimestamp = i[1].createdTimestamp;
                                    message.editedTimestamp = i[1].editedTimestamp;
                                    message.channelId = i[1].channel.id;
                                    message.guildId = i[1].guild.id;
                                    message.deleted = i[1].deleted;
                                    message._id = i[1].id;
                                    message.type = i[1].type;
                                    message.system = i[1].system;
                                    message.content = i[1].content;
                                    message.authorId = i[1].author.id;
                                    message.pinned = i[1].pinned;
                                    message.tts = i[1].tts;
                                    allMessages.push(message);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, messages_1 = messages;
                    _a.label = 5;
                case 5:
                    if (!(_i < messages_1.length)) return [3 /*break*/, 8];
                    i = messages_1[_i];
                    return [5 /*yield**/, _loop_1(i)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: return [4 /*yield*/, persistMessagesForChannel(allMessages)];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10: return [3 /*break*/, 3];
                case 11: return [3 /*break*/, 13];
                case 12:
                    err_7 = _a.sent();
                    logger_1.logger.error("Error inserting messages: ".concat(err_7));
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
function persistMessagesForChannel(messages) {
    return __awaiter(this, void 0, void 0, function () {
        var subMessages, dbo, result, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    _a.label = 1;
                case 1:
                    if (!(messages.length > 0)) return [3 /*break*/, 3];
                    subMessages = messages.splice(0, 100);
                    dbo = mongoUtil_1.MongoUtil.getDb();
                    return [4 /*yield*/, dbo.collection("message").insertMany(subMessages, { ordered: false })];
                case 2:
                    result = _a.sent();
                    if (result === null || result === undefined) {
                        logger_1.logger.error("Messages were inserted unsuccessfully");
                    }
                    else {
                        logger_1.logger.error("Messages were inserted successfully");
                    }
                    return [3 /*break*/, 1];
                case 3: return [3 /*break*/, 5];
                case 4:
                    err_8 = _a.sent();
                    logger_1.logger.error(err_8);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
module.exports = {
    fetchChannelsByServerId: fetchChannelsByServerId,
    fetchServers: fetchServers,
    fetchServerIconLink: fetchServerIconLink,
    fetchServerById: fetchServerById,
    postMessage: postMessage,
    storeServerContents: storeServerContents,
    fetchServerMessagesByChannelId: fetchServerMessagesByChannelId,
    copyServerContents: copyServerContents,
    fetchMembersByServerId: fetchMembersByServerId,
    fetchRolesByServerId: fetchRolesByServerId,
    fetchUsersByServerId: fetchUsersByServerId,
    fetchEmojisByServerId: fetchEmojisByServerId,
    fetchStickersByServerId: fetchStickersByServerId
};
//# sourceMappingURL=ServerManagement.js.map