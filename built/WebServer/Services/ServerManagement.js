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
        var guild, guildModel, guildMembers, guildChannels, guildRoles, emojis, dbo, result, guildMembersModels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.guilds.fetch(serverId)];
                case 1:
                    guild = _a.sent();
                    guildModel = {};
                    //setting guild properties to store in MongoDB
                    guildModel._id = guild.id;
                    guildModel.name = guild.name;
                    guildModel.icon = guild.icon;
                    guildModel.features = guild.features;
                    return [4 /*yield*/, guild.members.fetch()];
                case 2:
                    guildMembers = _a.sent();
                    guildModel.members = [];
                    guildMembers.forEach(function (value, key) { return guildModel.members.push(value.id); });
                    return [4 /*yield*/, guild.channels.fetch()];
                case 3:
                    guildChannels = _a.sent();
                    guildModel.channels = [];
                    guildChannels.forEach(function (value, key) { return guildModel.channels.push(value.id); });
                    return [4 /*yield*/, guild.roles.fetch()];
                case 4:
                    guildRoles = _a.sent();
                    guildModel.roles = [];
                    guildRoles.forEach(function (value, key) { return guildModel.roles.push(value.id); });
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
                case 5:
                    emojis = _a.sent();
                    guildModel.emojis = [];
                    emojis.forEach(function (value, key) { return guildModel.emojis.push(value.id); });
                    guildModel.nameAcronym = guild.nameAcronym;
                    guildModel.splashURL = guild.splashURL();
                    guildModel.bannerURL = guild.bannerURL();
                    guildModel.discoverySplashURL = guild.discoverySplashURL();
                    dbo = mongoUtil_1.MongoUtil.getDb();
                    return [4 /*yield*/, dbo.collection("guild").insertOne(guildModel)];
                case 6:
                    result = _a.sent();
                    if (result === null || result === undefined) {
                        logger_1.logger.error("Guild insert was unsuccessful");
                    }
                    guildMembersModels = [];
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
                        guildMembersModels.push(guildMemberModel);
                    });
                    return [4 /*yield*/, dbo.collection("guildmember").insertMany(guildMembersModels)];
                case 7:
                    result = _a.sent();
                    if (result === null || result === undefined) {
                        logger_1.logger.error("GuildMember insert was unsuccessful");
                    }
                    return [2 /*return*/, guildModel];
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