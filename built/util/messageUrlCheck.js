var isUrl = require('src/util/isUrl');
module.exports =
    {
        name: "messageUrlCheck",
        description: "Checks if a message contains a url",
        execute: function (content) {
            var status = false;
            for (var i = 0; i < content.length; i++) {
                for (var j = i; j < content.length; j++) {
                    var tempString = content.substring(i, j + 1);
                    if (isUrl.execute(tempString)) {
                        return true;
                    }
                }
            }
            return status;
        }
    };
