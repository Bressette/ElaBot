"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord = require('discord.js');
var Client = discord.Client, Intents = discord.Intents;
var client = new Client({ intents: [Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILDS]
});
var mongoUtil_1 = require("./util/mongoUtil");
var config = require('./config.json');
var fs = require('fs');
client.commands = new discord.Collection();
client.queue = new Map();
client.prefix = new Map();
require('./WebServer/Services/AppEndpoints')(client);
var logger_1 = require("./logger");
var getDirectories = fs.readdirSync('./commands', { withFileTypes: true }).filter(function (dirent) { return dirent.isDirectory(); })
    .map(function (dirent) { return dirent.name; });
var commandFiles = fs.readdirSync('./commands').filter(function (file) { return file.endsWith('.js'); });
for (var _i = 0, commandFiles_1 = commandFiles; _i < commandFiles_1.length; _i++) {
    var file = commandFiles_1[_i];
    var command = require("./commands/".concat(file));
    client.commands.set(command.name, command);
}
for (var _a = 0, getDirectories_1 = getDirectories; _a < getDirectories_1.length; _a++) {
    var directory = getDirectories_1[_a];
    var commandFiles_3 = fs.readdirSync("./commands/".concat(directory)).filter(function (file) { return file.endsWith('.js'); });
    for (var _b = 0, commandFiles_2 = commandFiles_3; _b < commandFiles_2.length; _b++) {
        var file = commandFiles_2[_b];
        var command = require("./commands/".concat(directory, "/").concat(file));
        client.commands.set(command.name, command);
    }
}
var eventFiles = fs.readdirSync('./events').filter(function (file) { return file.endsWith('.js'); });
var _loop_1 = function (file) {
    var event_1 = require("./events/".concat(file));
    if (event_1.once) {
        client.once(event_1.name, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return event_1.execute.apply(event_1, args);
        });
    }
    else {
        client.on(event_1.name, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return event_1.execute.apply(event_1, __spreadArray(__spreadArray([], args, false), [client], false));
        });
    }
};
for (var _c = 0, eventFiles_1 = eventFiles; _c < eventFiles_1.length; _c++) {
    var file = eventFiles_1[_c];
    _loop_1(file);
}
mongoUtil_1.MongoUtil.connectToServer(function () {
});
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});
client.login(config.token).then(function (val) { return logger_1.logger.info("Bot logged into Discord Bot Client"); })
    .catch(function (err) { return logger_1.logger.error("Failed to login to the Discord Bot Client: " + err); });
