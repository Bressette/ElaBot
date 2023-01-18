"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoUtil_1 = require("../../../util/mongoUtil");
module.exports =
    {
        execute: function (name, amount) {
            //connect to mongodb
            var dbo = mongoUtil_1.MongoUtil.getDb();
            //retrieve the record for the given user
            dbo.collection("users").findOne({ name: name }, function (err, result) {
                if (err)
                    throw err;
                //if the user does not exist insert the user with the given amount
                if (result === null) {
                    dbo.collection("users").insertOne({ name: name, amount: amount }, function (err, result) {
                        if (err)
                            throw err;
                    });
                }
                //if the user already exists update the record with the new amount
                else {
                    dbo.collection("users").updateOne({ name: name }, { $set: { name: name, amount: (result.amount + amount) } }, function (err, res) {
                    });
                }
            });
        }
    };
//# sourceMappingURL=addbalance.js.map