module.exports =
    {
        name: "pushMessages",
        description: "pushes messages onto a target array and returns the resultant array",
        execute: function (messages, destination) {
            for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
                var i = messages_1[_i];
                destination.push(i);
            }
            return destination;
        }
    };
