var winston = require('winston');

var levelLog;
if(!process.env.NODE_ENV || process.env.NODE_ENV=== "production"){
    levelLog = "info";
} else {
    levelLog = "trace";
}
console.log(levelLog);

// Set up logger
var customColors = {
    trace: 'white',
    debug: 'green',
    info: 'green',
    warn: 'yellow',
    crit: 'red',
    fatal: 'red'
};

var logger = new(winston.Logger)({
    colors: customColors,
    levels: {
        trace: 0,
        debug: 1,
        info: 2,
        warn: 3,
        crit: 4,
        fatal: 5
    },
    transports: [
        new(winston.transports.Console)({
            level: levelLog,
            colorize: true,
            timestamp: true
        })
    ]
});

winston.addColors(customColors);

// Extend logger object to properly log 'Error' types
var origLog = logger.log;

logger.log = function (level, msg) {
    var objType = Object.prototype.toString.call(msg);
    if (objType === '[object Error]') {
        origLog.call(logger, level, msg.toString());
    } else {
        origLog.call(logger, level, msg);
    }
};

 //
 //logger.trace('testing');
 //logger.debug('testing');
 //logger.info('testing');
 //logger.warn('testing');
 //logger.crit('testing');
 //logger.fatal('testing');


module.exports = logger;