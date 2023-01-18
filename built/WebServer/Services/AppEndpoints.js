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
var express = require('express');
var app = express();
var port = 8093;
var serverManagement = require("./ServerManagement");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
// @ts-ignore
var getMessages = require("../../util/getMessages");
module.exports = function (client) {
    var _this = this;
    //endpoints used to retrieve server info for connected servers
    app.get('/discord/channels/:serverId', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var channels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, serverManagement.fetchChannelsByServerId(req.params.serverId, client)];
                case 1:
                    channels = _a.sent();
                    res.json(channels);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/discord/roles/:serverId', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var roles, outputJson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, serverManagement.fetchRolesByServerId(req.params.serverId, client)];
                case 1:
                    roles = _a.sent();
                    outputJson = JSON.stringify(roles, function (key, value) {
                        return typeof value === "bigint" ? value.toString() + "n" : value;
                    });
                    res.setHeader('Content-Type', 'application/json');
                    res.end(outputJson);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/discord/servers', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var servers, outputJson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, serverManagement.fetchServers(client)];
                case 1:
                    servers = _a.sent();
                    console.log("Retrieved servers: ".concat(servers.size));
                    outputJson = JSON.stringify(servers, function (key, value) {
                        return typeof value === "bigint" ? value.toString() + "n" : value;
                    });
                    res.setHeader('Content-Type', 'application/json');
                    res.end(outputJson);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/discord/server/icon/:serverId', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _b = (_a = res).json;
                    _c = {};
                    return [4 /*yield*/, serverManagement.fetchServerIconLink(client, req.params.serverId)];
                case 1:
                    _b.apply(_a, [(_c.iconUrl = _d.sent(), _c)]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/discord/server/:serverId', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = res).json;
                    return [4 /*yield*/, serverManagement.fetchServerById(client, req.params.serverId)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/discord/server/:serverId/members', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = res).json;
                    return [4 /*yield*/, serverManagement.fetchMembersByServerId(client, req.params.serverId)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/discord/server/:serverId/users', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = res).json;
                    return [4 /*yield*/, serverManagement.fetchUsersByServerId(client, req.params.serverId)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/discord/server/:serverId/emojis', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = res).json;
                    return [4 /*yield*/, serverManagement.fetchEmojisByServerId(client, req.params.serverId)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/discord/server/:serverId/stickers', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = res).json;
                    return [4 /*yield*/, serverManagement.fetchStickersByServerId(client, req.params.serverId)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    // implement mongodb find to retrieve the messages for a certain channel in a server
    app.get('/discord/messages/:serverId/:channelId/:messageCount', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var guild, channel, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client.guilds.fetch(req.params.serverId)];
                case 1:
                    guild = _c.sent();
                    return [4 /*yield*/, guild.channels.fetch(req.params.channelId)];
                case 2:
                    channel = _c.sent();
                    _b = (_a = res).json;
                    return [4 /*yield*/, getMessages.execute(channel, req.params.messageCount)];
                case 3:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/discord/embed', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var guild, channel, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client.guilds.fetch("502575389550575636")];
                case 1:
                    guild = _c.sent();
                    return [4 /*yield*/, guild.channels.fetch("732241819374583916")];
                case 2:
                    channel = _c.sent();
                    _b = (_a = res).json;
                    return [4 /*yield*/, channel.messages.fetch("1064980486251876543")];
                case 3:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    // //fetch messages directly from discord.js
    // app.get('/discordapi/messages/:serverId/:channelId/:messageCount', async(req, res) => {
    //     res.json(await fetchServerMessagesByChannelId(req.params.serverId, req.params.channelId, 10))
    // });
    app.post('/discord/message/:serverId/:channelId', jsonParser, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, serverManagement.postMessage(client, req.params.serverId, req.params.channelId, req.body.message)];
                case 1:
                    _a.sent();
                    res.sendStatus(200);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/discord/copy', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, serverManagement.copyServerContents(req.query.sourceGuildId, req.query.targetGuildId, client)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    app.listen(port, function () {
        console.log("App listening at port: ".concat(port));
    });
};
