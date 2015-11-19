var logger = require('libs/log');
var jwt = require('jsonwebtoken');
var environment = require('configuration');
var socketMessageHelper = require('./socketMessageHelper');
var socketResponseHelper = require('./socketResponseHelper');

var CLIENTS = {};

var saveNewConnection = function (userId, connection) {
    connection.userId = userId;
    connection.pingTime = new Date().getTime();
    CLIENTS[userId] = connection;
    connection.send("200 ok");
    logger.info('created connection with user ' + userId);
};

exports.onConnection = function (newWS) {
    var token = url.parse(ws.upgradeReq.url, true).query.token;

    if (token) {
        jwt.verify(token, environment.get('app_key'), function (err, decoded) {
            if (err) {
                newWS.send('Wrong user token');
                newWS.close();
            } else {
                saveNewConnection(decoded._id, newWS);
            }
        });
    } else {
        newWS.send('Wrong user token');
        newWS.close();
    }
};


exports.onCloseConnection = function (code, reason) {
    delete CLIENTS[this.userId];
    logger.info('deleted connection with user ' + userId + ' code: ' + code + " reason: " + reason);
};

exports.onMessage = function (message) {
    try {
        var jsonMessage = JSON.parse(message);
        this.pingTime =  new Date().getTime();
        var object = socketMessageHelper.isMessage(jsonMessage);
        if(object){
            socketMessageHelper.sendMessageToOtherUsers(object, CLIENTS);
        }
    } catch (err) {
        socketResponseHelper.respondWithErrors(this, err);
    }
};




