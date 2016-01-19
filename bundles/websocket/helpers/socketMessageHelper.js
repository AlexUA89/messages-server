var async = require('neo-async');
var Message = require('models').Message;
var socketResponseHelper = require('./socketResponseHelper');
var ChatGroup = require('models').ChatGroup;
var clientsContainer = require('./clientsContainer');


exports.isMessage = function (message) {
    if (message.message && message.userId && message.userName && (message.toUserId || message.chatGroupId || (message.xCoord && message.yCoord))) {

        var newMessage = new Message({
            message: message.message,
            xCoord: messagexCoord,
            yCoord: message.yCoord,
            toUserId: message.toUserId,
            chatGroupId: message.chatGroupId,
            userId: message.userId,
            userName: message.userName,
            time: new Date().getTime()
        });
        return newMessage;
    }
};

exports.isPing = function (message) {

};

exports.sendMessageToOtherUsers = function (message) {
    var savedMessage;
    async.waterfall([
        function (callback) {
            message.save(callback);
        },
        function (result, callback) {
            savedMessage = result;
            ChatGroup.findOne({ _id: message.chatGroupId }).exec(callback);
        },
        function (group, callback) {
            var users = group.users;
            users.forEach(function(user) {
                var connection = clientsContainer.getConnectionByID(user);
                if(connection) {
                    socketResponseHelper.sendData(connection, savedMessage);
                }
            });
            callback();
        }
    ], function (err) {
        if (err) {
            throw err;
        }
    });
};

//TODO implement private message sending


