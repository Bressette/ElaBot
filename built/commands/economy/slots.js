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
var getSlotSize = require('./util/getslotsize');
// @ts-ignore
var getBalance = require('./util/getbalance');
var printBalance = require('./balance');
// @ts-ignore
var addBalance = require('./util/addbalance');
module.exports =
    {
        name: "slots",
        description: "Gambles balance using a slot machine",
        aliases: [],
        execute: function (message, args) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, slotSize, amount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            userId = message.author.id;
                            return [4 /*yield*/, getSlotSize.execute(message)];
                        case 1:
                            slotSize = _a.sent();
                            if (slotSize === undefined)
                                slotSize = 3;
                            amount = parseInt(args[0]);
                            if (!isNaN(amount) && isFinite(amount) && amount > 0) {
                                //call get balance to check if the user entered a value to stake
                                getBalance.execute(userId, function (balance) {
                                    if (amount > balance) {
                                        message.channel.send("You cannot gamble more than you have!");
                                    }
                                    //if amount is a number execute the coinflip
                                    else {
                                        var slotDisplay = "";
                                        var slotArray = [];
                                        var results = [];
                                        //loop that computes the random values and adds the emoticons to slotDisplay
                                        for (var i = 1; i <= slotSize * slotSize; i++) {
                                            var rollSlots = Math.floor(Math.random() * 100);
                                            slotArray[i - 1] = module.exports.getSlotEmoji(rollSlots);
                                            slotDisplay += slotArray[i - 1];
                                            if (i % slotSize === 0)
                                                slotDisplay += "\n";
                                        }
                                        //loop that computes if the rows and columns are winning values
                                        for (var i = 0; i < slotSize; i++) {
                                            var rowCounter = 0;
                                            var columnCounter = 0;
                                            for (var j = 0; j < slotSize - 1; j++) {
                                                if (slotArray[i * slotSize + j] === slotArray[i * slotSize + j + 1])
                                                    rowCounter++;
                                                if (slotArray[j * slotSize + i] === slotArray[(j + 1) * slotSize + i])
                                                    columnCounter++;
                                            }
                                            if (rowCounter === slotSize - 1)
                                                results.push(slotArray[i * slotSize]);
                                            if (columnCounter === slotSize - 1)
                                                results.push(slotArray[i]);
                                        }
                                        //loop that computes if the diagonals are winning values
                                        var counter = 0;
                                        var secondCounter = 0;
                                        for (var i = 0; i < slotSize - 1; i++) {
                                            if (slotArray[i * slotSize + i] === slotArray[(i + 1) * slotSize + i + 1])
                                                counter++;
                                            if (slotArray[slotSize * slotSize - slotSize - i * slotSize + i] === slotArray[slotSize * slotSize - slotSize - (i + 1) * slotSize + i + 1])
                                                secondCounter++;
                                        }
                                        if (counter === slotSize - 1)
                                            results.push(slotArray[0]);
                                        if (secondCounter === slotSize - 1)
                                            results.push(slotArray[slotSize]);
                                        //displays the slot emoticons
                                        if (slotDisplay)
                                            message.channel.send(slotDisplay);
                                        var reward = 0;
                                        if (results.length === 0) {
                                            message.channel.send("No rows won");
                                            addBalance.execute(userId, -Math.abs(amount));
                                        }
                                        else {
                                            //iterates over the winning rows and adds the winning amount to reward 
                                            for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                                                var i = results_1[_i];
                                                switch (i) {
                                                    case ":seven:":
                                                        reward += Math.ceil((1) * (slotSize / 3) * amount + amount);
                                                        break;
                                                    case ":game_die:":
                                                        reward += Math.ceil((3 / 2) * (slotSize / 3) * amount + amount);
                                                        break;
                                                    case ":cherries:":
                                                        reward += Math.ceil((2) * (slotSize / 3) * amount + amount);
                                                        break;
                                                    case ":crown:":
                                                        reward += Math.ceil((5 / 2) * (slotSize / 3) * amount + amount);
                                                        break;
                                                    case ":moneybag:":
                                                        reward += Math.ceil((5 / 2) * (slotSize / 3) * amount + amount);
                                                        break;
                                                }
                                            }
                                            addBalance.execute(userId, Math.abs(reward));
                                            message.channel.send("You won " + results.length + " rows");
                                        }
                                        //tell the user their new balance after waiting for db to finish
                                        setTimeout(function () {
                                            printBalance.execute(message, []);
                                        }, 100);
                                    }
                                });
                            }
                            else {
                                if (isNaN(amount)) {
                                    message.channel.send("You must enter a number to gamble!");
                                }
                                else if (!isFinite(amount)) {
                                    message.channel.send("You cannot gamble an infinite amount of money!");
                                }
                                else if (amount < 0) {
                                    message.channel.send("You cannot gamble negative money!");
                                }
                                else if (amount === 0) {
                                    message.channel.send("You cannot gamble 0!");
                                }
                                else {
                                    message.channel.send("You must enter a valid number to gamble!");
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        getSlotEmoji: function (value) {
            if (value < 30)
                return ":seven:";
            else if (value >= 30 && value < 55)
                return ":game_die:";
            else if (value >= 55 && value < 70)
                return ":cherries:";
            else if (value >= 70 && value < 85)
                return ":crown:";
            else if (value >= 85 && value < 100)
                return ":moneybag:";
            else
                return ":seven:";
        }
    };
//# sourceMappingURL=slots.js.map