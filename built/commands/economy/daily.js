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
var addBalance = require('./util/addbalance');
var balance = require('./balance');
var mongoUtil_1 = require("../../util/mongoUtil");
module.exports =
    {
        name: "daily",
        description: "Claims the daily balance",
        aliases: [],
        execute: function (message, args) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, dailyAmount, dbo, date, userData, storedDate, timeDiff, targetTime, remainingTime, remainingHours, remainingMinutes, hours, minutes, seconds;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            userId = message.author.id;
                            console.log(userId);
                            dailyAmount = 5000;
                            console.log("In daily");
                            dbo = mongoUtil_1.MongoUtil.getDb();
                            date = new Date();
                            return [4 /*yield*/, dbo.collection("users").findOne({ name: userId })];
                        case 1:
                            userData = _a.sent();
                            if (userData === undefined || userData === null) {
                                dbo.collection("users").insertOne({ name: userId, amount: dailyAmount, date: date }, function (err, result) {
                                    if (err)
                                        throw err;
                                    message.channel.send("You claimed your daily balance of ".concat(dailyAmount, ". Wait 24h to claim it again"));
                                });
                            }
                            else {
                                if (userData.date === null || userData.date === undefined) {
                                    addBalance.execute(userId, dailyAmount);
                                    dbo.collection("users").updateOne({ name: userId }, { $set: { date: date } }, function (err, res) {
                                    });
                                    message.channel.send("You claimed your daily balance of ${dailyAmount}. Wait 24h to claim it again");
                                    setTimeout(function () {
                                        var temp = [];
                                        balance.execute(message, temp);
                                    }, 100);
                                }
                                else {
                                    storedDate = new Date(userData.date);
                                    timeDiff = date.getTime() - storedDate.getTime();
                                    targetTime = storedDate.getTime() + 24 * 3600000;
                                    if (timeDiff > 24 * 3600000) {
                                        addBalance.execute(userId, dailyAmount);
                                        dbo.collection("users").updateOne({ name: userId }, { $set: { date: date } }, function (err, res) {
                                        });
                                        message.channel.send("You claimed your daily balance of ".concat(dailyAmount, ". Wait 24h to claim it again"));
                                        setTimeout(function () {
                                            balance.execute(message, []);
                                        }, 100);
                                    }
                                    else {
                                        targetTime = (storedDate.getTime() / 1000) + 24 * 3600;
                                        remainingTime = targetTime - (date.getTime() / 1000);
                                        remainingHours = Math.floor(remainingTime / 3600);
                                        remainingTime -= remainingHours * 3600;
                                        remainingMinutes = Math.floor(remainingTime / 60);
                                        remainingTime -= remainingMinutes * 60;
                                        remainingTime = Math.floor(remainingTime);
                                        hours = remainingHours.toString();
                                        minutes = remainingMinutes.toString();
                                        seconds = remainingTime.toString();
                                        if (remainingHours < 10) {
                                            hours = "0" + hours;
                                        }
                                        if (remainingMinutes < 10) {
                                            minutes = "0" + minutes;
                                        }
                                        if (remainingTime < 10) {
                                            seconds = "0" + seconds;
                                        }
                                        message.channel.send("You need to wait ".concat(hours, ":").concat(minutes, ":").concat(seconds, " to claim a daily balance"));
                                    }
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
    };
