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
// @ts-ignore
var getMessages = require('../../util/getMessages');
var pushMessages = require('../../util/pushMessages');
var storeMessages = require('../../util/storeMessages');
module.exports =
    {
        name: "storeserver",
        description: "Stores all of the messages in the current server in a mongodb database",
        aliases: [],
        execute: function (message, args) {
            return __awaiter(this, void 0, void 0, function () {
                var channels, allMessages, _i, _a, _b, key, value, messages;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            message.channel.send("Storing server content in the database");
                            console.log('Collecting all of the messages in the server');
                            return [4 /*yield*/, message.guild.channels.fetch()];
                        case 1:
                            channels = _c.sent();
                            console.log("Channels: ".concat(JSON.stringify(channels)));
                            allMessages = [];
                            _i = 0, _a = channels.entries();
                            _c.label = 2;
                        case 2:
                            if (!(_i < _a.length)) return [3 /*break*/, 5];
                            _b = _a[_i], key = _b[0], value = _b[1];
                            console.log('Iterating over element: ' + JSON.stringify(value));
                            if (!value.isText()) return [3 /*break*/, 4];
                            console.log('Fetching the message for channel');
                            return [4 /*yield*/, getMessages.execute(value, 1000000)];
                        case 3:
                            messages = _c.sent();
                            console.log('About to push retrieved messages: ' + messages.length);
                            allMessages = pushMessages.execute(messages, allMessages);
                            console.log('Pushed messages into allMessages: ' + allMessages.length);
                            _c.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5:
                            console.log('Length of all messages: ' + allMessages.length);
                            return [4 /*yield*/, storeMessages.execute(allMessages)];
                        case 6:
                            _c.sent();
                            message.channel.send("Successfully stored all server content");
                            return [2 /*return*/];
                    }
                });
            });
        }
    };
//# sourceMappingURL=storeServerMessages.js.map