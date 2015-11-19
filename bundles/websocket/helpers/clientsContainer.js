var frequencySocketPingMessage = require( 'configuration').get('clientConfig:frequencySocketPingMessage');

var CLIENTS = {};


exports.addNewClient = function(connection, userId) {
    connection.userId = userId;
    connection.pingTime = new Date().getTime();
    CLIENTS[userId] = connection;
    connection.send("200 ok");
    logger.info('created connection with user ' + userId);
};

exports.removeClient = function(connection) {
    delete CLIENTS[connection.userId];
};

exports.refreshClient = function(connection) {
    connection.pingTime = new Date().getTime();
};

exports.getConnectionByID = function(userId) {
    if(!CLIENTS[userId]) {
        return null;
    }
    var time = new Date().getTime();
    if( CLIENTS[userId].pingTime < (time - frequencySocketPingMessage*1000)){
        CLIENTS[userId].close();
        delete CLIENTS[userId];
        logger.info('TIMEOUT removed connection with user ' + userId);
        return null;
    }
    return CLIENTS[userId];
};

