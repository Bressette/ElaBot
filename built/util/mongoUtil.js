"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoUtil = void 0;
var mongodb_1 = require("mongodb");
var MongoUtil = /** @class */ (function () {
    function MongoUtil() {
    }
    MongoUtil.connectToServer = function (callback) {
        mongodb_1.MongoClient.connect(MongoUtil.url, { useUnifiedTopology: true }, function (err, client) {
            MongoUtil.db = client.db('ela-bot');
            return callback(err);
        });
    };
    MongoUtil.getDb = function () {
        return MongoUtil.db;
    };
    MongoUtil.url = 'mongodb://127.0.0.1:27017';
    return MongoUtil;
}());
exports.MongoUtil = MongoUtil;
//# sourceMappingURL=mongoUtil.js.map