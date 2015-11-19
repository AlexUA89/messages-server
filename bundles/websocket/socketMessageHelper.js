var async = require('neo-async');
var Message = require('models').Message;
var socketResponseHelper = require('./socketResponseHelper');
var ChatGroup = require('models').ChatGroup;


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

exports.sendMessageToOtherUsers = function (message, allClients) {
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
                socketResponseHelper.sendData(allClients[user], savedMessage);
            });
            callback();
        }
    ], function (err) {
        if (err) {
            throw err;
        }
    });
};


