var logger = require('libs/log');
var jwt = require('jsonwebtoken');
var environment = require('configuration');
var url = require('url');
var socketMessageHelper = require('./helpers/socketMessageHelper');
var socketResponseHelper = require('./helpers/socketResponseHelper');
var clientsContainer = require('./helpers/clientsContainer');

exports.onConnection = function (newWS) {
    var token = url.parse(newWS.upgradeReq.url, true).query.token;

    if (token) {
        jwt.verify(token, environment.get('app_key'), function (err, decoded) {
            if (err) {
                newWS.send('Wrong user token');
                newWS.close();
            } else {
                clientsContainer.addNewClient(newWS, decoded._id);
            }
        });
    } else {
        newWS.send('Wrong user token');
        newWS.close();
    }
};

exports.onCloseConnection = function (userId, code, reason) {
    clientsContainer.removeClient(userId);
    logger.info('deleted connection with user ' + userId + ' code: ' + code + " reason: " + reason);
};

exports.onMessage = function (userId, message) {
    try {
        var jsonMessage = JSON.parse(message);
        clientsContainer.refreshClient(userId);
        var messageCode = jsonMessage.code;
        socketResponseHelper.sendData(clientsContainer.getConnectionByID(userId), null, messageCode);
        logger.info('have sent ok to userId');
        var object = socketMessageHelper.isMessage(jsonMessage);
        if (object) {
            socketMessageHelper.sendMessageToOtherUsers(object);
        }
    } catch (err) {
        socketResponseHelper.respondWithErrors(clientsContainer.getConnectionByID(userId), err);
    }
};




