var Message = require('models').Message;
var async = require('neo-async');
var responseHelper = require('helpers').responseHelper;

var helper = {

    sendMessage: function (req, res, next) {
        async.waterfall([
            function (callback) {
                var message = new Message({
                    message: req.body.message,
                    xCoord: req.body.xCoord,
                    yCoord: req.body.yCoord,
                    toUserId: req.body.toUserId,
                    chatGroupId: req.body.chatGroupId,
                    userId: req.jwtUser._id,
                    userName: req.jwtUser.name,
                    time: new Date().getTime()
                });
                message.save(callback);
            }
        ], function (err, result) {

            if (err) {
                throw err;
            }
            responseHelper.respondWithOneSuccess(res, 'Message is sent.');
        });
    },

    getMessages: function (req, res, next) {

        async.waterfall([
            function (callback) {
                var xCoord = req.params.xCoord;
                var yCoord = req.params.yCoord;
                var radius = req.params.radius;
                var time = Number(req.params.time) * 1000;

                var currentTime = new Date().getTime();
                Message.find().where('yCoord').gt(yCoord - radius).lt(yCoord + radius)
                    .where('xCoord').gt(xCoord - radius).lt(xCoord + radius).where('time').gt(currentTime - time)
                    .exec(callback);
            },
            function (messages, callback) {

                var result = [];
                messages.forEach(function (message) {
                    result.push(message);
                });
                callback(null, result);
            }
        ], function (err, result) {

            if (err) {
                return next(err);
            }

            responseHelper.respondWithManySuccess(res, result);
        });

    },

    getPrivateMessages: function (req, res, next) {
        var time = Number(req.params.time) * 1000;
        async.waterfall([
            function (callback) {
                var currentTime = new Date().getTime();
                Message.find({toUserId: req.jwtUser._id}).where('time').gt(currentTime - time)
                    .exec(callback);
            },
            function (messages, callback) {
                var result = [];
                messages.forEach(function (message) {
                    result.push(message);
                });
                callback(null, result);
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }
            responseHelper.respondWithManySuccess(res, result);
        });
    },


    getGroupsMessages: function (req, res, next) {
        var time = Number(req.params.time) * 1000;
        var groupId = req.query.groupId;
        async.waterfall([
            function (callback) {
                var currentTime = new Date().getTime();
                Message.find({chatGroupId: groupId}).where('time').gt(currentTime - time)
                    .exec(callback);
            },
            function (messages, callback) {
                var result = [];
                messages.forEach(function (message) {
                    result.push(message);
                });
                callback(null, result);
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }
            responseHelper.respondWithManySuccess(res, result);
        });
    }

};

module.exports = helper;

