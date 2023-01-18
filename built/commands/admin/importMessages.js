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
var _this = this;
importLinks: (function (client) { return __awaiter(_this, void 0, void 0, function () {
    var _i, allMessages_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.channels.fetch("610639803662336021")];
            case 1:
                general = _a.sent();
                return [4 /*yield*/, client.channels.fetch("507998836233338882")];
            case 2:
                maymays = _a.sent();
                return [4 /*yield*/, client.channels.fetch("507998917846106162")];
            case 3:
                videos = _a.sent();
                return [4 /*yield*/, client.channels.fetch("518655793961369602")];
            case 4:
                linksherenerds = _a.sent();
                return [4 /*yield*/, client.channels.fetch("559017797057773580")];
            case 5:
                brucemad = _a.sent();
                return [4 /*yield*/, client.channels.fetch("574067019381735435")];
            case 6:
                dcbadhaha = _a.sent();
                return [4 /*yield*/, client.channels.fetch("589595674971209729")];
            case 7:
                rankedflex = _a.sent();
                return [4 /*yield*/, client.channels.fetch("611679566938898626")];
            case 8:
                art = _a.sent();
                return [4 /*yield*/, client.channels.fetch("629133817101287443")];
            case 9:
                minecraft = _a.sent();
                return [4 /*yield*/, client.channels.fetch("635974542468186142")];
            case 10:
                epicbot = _a.sent();
                return [4 /*yield*/, client.channels.fetch("638374818059649024")];
            case 11:
                spaceengineers = _a.sent();
                return [4 /*yield*/, client.channels.fetch("653714617268174848")];
            case 12:
                lmaobryceislame = _a.sent();
                return [4 /*yield*/, client.channels.fetch("662437212633169950")];
            case 13:
                vr = _a.sent();
                return [4 /*yield*/, client.channels.fetch("715776883945504769")];
            case 14:
                bots = _a.sent();
                allMessages = [];
                return [4 /*yield*/, module.exports.getMessages(general, 1000000)];
            case 15:
                messages = _a.sent();
                allMessages = module.exports.pushMessages(messages, allMessages);
                return [4 /*yield*/, module.exports.getMessages(maymays, 1000000)];
            case 16:
                messages = _a.sent();
                allMessages = module.exports.pushMessages(messages, allMessages);
                return [4 /*yield*/, module.exports.getMessages(videos, 1000000)];
            case 17:
                messages = _a.sent();
                allMessages = module.exports.pushMessages(messages, allMessages);
                return [4 /*yield*/, module.exports.getMessages(linksherenerds, 1000000)];
            case 18:
                messages = _a.sent();
                allMessages = module.exports.pushMessages(messages, allMessages);
                return [4 /*yield*/, module.exports.getMessages(brucemad, 1000000)];
            case 19:
                messages = _a.sent();
                allMessages = module.exports.pushMessages(messages, allMessages);
                return [4 /*yield*/, module.exports.getMessages(dcbadhaha, 1000000)];
            case 20:
                messages = _a.sent();
                allMessages = module.exports.pushMessages(messages, allMessages);
                return [4 /*yield*/, module.exports.getMessages(rankedflex, 1000000)];
            case 21:
                messages = _a.sent();
                allMessages = module.exports.pushMessages(messages, allMessages);
                return [4 /*yield*/, module.exports.getMessages(art, 1000000)];
            case 22:
                messages = _a.sent();
                allMessages = module.exports.pushMessages(messages, allMessages);
                return [4 /*yield*/, module.exports.getMessages(minecraft, 1000000)];
            case 23:
                messages = _a.sent();
                allMessages = module.exports.pushMessages(messages, allMessages);
                return [4 /*yield*/, module.exports.getMessages(epicbot, 1000000)];
            case 24:
                messages = _a.sent();
                allMessages = module.exports.pushMessages(messages, allMessages);
                return [4 /*yield*/, module.exports.getMessages(spaceengineers, 1000000)];
            case 25:
                messages = _a.sent();
                allMessages = module.exports.pushMessages(messages, allMessages);
                return [4 /*yield*/, module.exports.getMessages(lmaobryceislame, 1000000)];
            case 26:
                messages = _a.sent();
                allMessages = module.exports.pushMessages(messages, allMessages);
                return [4 /*yield*/, module.exports.getMessages(vr, 1000000)];
            case 27:
                messages = _a.sent();
                allMessages = module.exports.pushMessages(messages, allMessages);
                return [4 /*yield*/, module.exports.getMessages(bots, 1000000)];
            case 28:
                messages = _a.sent();
                allMessages = module.exports.pushMessages(messages, allMessages);
                allMessages.sort(function (a, b) {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                });
                console.log("After getting messages");
                _i = 0, allMessages_1 = allMessages;
                _a.label = 29;
            case 29:
                if (!(_i < allMessages_1.length)) return [3 /*break*/, 34];
                i = allMessages_1[_i];
                _a.label = 30;
            case 30:
                _a.trys.push([30, 32, , 33]);
                return [4 /*yield*/, module.exports.archiveMessages(i, client)];
            case 31:
                _a.sent();
                return [3 /*break*/, 33];
            case 32:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 33];
            case 33:
                _i++;
                return [3 /*break*/, 29];
            case 34: return [2 /*return*/];
        }
    });
}); });
