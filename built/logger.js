"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var winston = require('winston');
var logConfiguration = {
    'transports': [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'application.log'
        })
    ]
};
var logger = winston.createLogger(logConfiguration);
exports.logger = logger;
//# sourceMappingURL=logger.js.map