var logger = require('libs/log');
var jwt = require('jsonwebtoken');
var environment = require('configuration');
var socketMessageHelper = require('./helpers/socketMessageHelper');
var socketResponseHelper = require('./helpers/socketResponseHelper');
var clientsContainer = require('./helpers/clientsContainer');

exports.onConnection = function (newWS) {
    var token = url.parse(ws.upgradeReq.url, true).query.token;

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

exports.onCloseConnection = function (code, reason) {
    clientsContainer.removeClient(this);
    logger.info('deleted connection with user ' + userId + ' code: ' + code + " reason: " + reason);
};

exports.onMessage = function (message) {
    try {
        var jsonMessage = JSON.parse(message);
        clientsContainer.refreshClient(this);
        var messageCode = jsonMessage.code;
        socketResponseHelper.sendData(this, null, messageCode);
        var object = socketMessageHelper.isMessage(jsonMessage);
        if (object) {
            socketMessageHelper.sendMessageToOtherUsers(object);
        }
    } catch (err) {
        socketResponseHelper.respondWithErrors(this, err);
    }
};




