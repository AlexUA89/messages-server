var frequencySocketPingMessage = require('configuration').get('clientConfig:frequencySocketPingMessage');
var logger = require('libs/log');
var actions = require('./../actions');

var CLIENTS = {};


exports.addNewClient = function (connection, userId) {
    connection.userId = userId;
    connection.pingTime = new Date().getTime();
    CLIENTS[userId] = connection;
    connection.send("created connection 200 ok");
    connection.onclose = function (event) {
        actions.onCloseConnection(userId, event.code, event.reason)
    };
    connection.onmessage = function (event) {
        actions.onMessage(userId, event.data);
    };
    logger.info('created connection with user ' + userId);
};

exports.removeClient = function (userId) {
    delete CLIENTS[userId];
};

exports.refreshClient = function (userId) {
    CLIENTS[userId].pingTime = new Date().getTime();
};

exports.getConnectionByID = function (userId) {
    if (!CLIENTS[userId]) {
        return null;
    }
    var time = new Date().getTime();
    if (CLIENTS[userId].pingTime < (time - frequencySocketPingMessage * 1000 * 60 - 1000)) {
        CLIENTS[userId].close();
        delete CLIENTS[userId];
        logger.info('TIMEOUT removed connection with user ' + userId);
        return null;
    }
    return CLIENTS[userId];
};

