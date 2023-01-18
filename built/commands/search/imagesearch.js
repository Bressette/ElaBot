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
var imageSearch = require('image-search-google');
var config = require('../../config.json');
var client = new imageSearch(config.csekey, config.googlekey);
var options = { page: 1 };
var isFullResults;
module.exports =
    {
        name: "imagesearch",
        description: "Searches for images using google image search",
        aliases: [],
        execute: function (message, args) {
            return __awaiter(this, void 0, void 0, function () {
                var content, images, results, j, k, i, i, images_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            content = message.content.substr(message.content.indexOf(args[0]), message.content.length);
                            if (content.includes("-full")) {
                                isFullResults = true;
                                content = content.substr(5, content.length).trim();
                            }
                            else
                                isFullResults = false;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, client.search(content, options)];
                        case 2:
                            images = _a.sent();
                            if (images) {
                                if (isFullResults) {
                                    results = [""];
                                    j = 0;
                                    k = 1;
                                    for (i in images) {
                                        if (images[i].url.includes("fbsbx.com"))
                                            continue;
                                        console.log(i);
                                        if (k % 6 === 0)
                                            j++;
                                        if (results[j] === undefined) {
                                            results[j] = "";
                                        }
                                        console.log("I in images");
                                        message.channel.send(images[i].url);
                                        k++;
                                    }
                                }
                                else {
                                    i = 0;
                                    while (images[i].url.includes("fbsbx.com")) {
                                        i++;
                                    }
                                    message.channel.send(images[i].url);
                                }
                            }
                            else
                                message.channel.send("There are no images for that query");
                            return [3 /*break*/, 4];
                        case 3:
                            images_1 = _a.sent();
                            message.channel.send("Error fetching image");
                            console.log(images_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    };
//# sourceMappingURL=imagesearch.js.map