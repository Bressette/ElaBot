const winston = require('winston');
const logConfiguration = {
    'transports': [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'application.log'
        })
    ]
}
const logger = winston.createLogger(logConfiguration);

export {logger};
