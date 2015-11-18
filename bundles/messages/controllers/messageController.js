var Message = require('models').Message;
var async = require('neo-async');
var responseHelper = require('helpers').responseHelper;
var ChatGroup = require('models').ChatGroup;

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
            responseHelper.respondWithSuccess(res, 'Message is sent.');
        });
    },

    getMessages: function (req, res, next) {

        async.waterfall([
            function (callback) {
                var xCoord = req.query.xCoord;
                var yCoord = req.query.yCoord;
                var radius = req.query.radius;
                var time = Number(req.query.time) * 1000;

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

            responseHelper.respondWithSuccess(res, result);
        });

    },

    getPrivateMessages: function (req, res, next) {
        var time = Number(req.query.time) * 1000;
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
            responseHelper.respondWithSuccess(res, result);
        });
    },


    getGroupsMessages: function (req, res, next) {
        var time = Number(req.query.time) * 1000;
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
            responseHelper.respondWithSuccess(res, result);
        });
    },

    getAllMessages: function (req, res, next) {
        var time = Number(req.query.time) * 1000;
        var xCoordl = req.query.xCoord_local;
        var yCoordl = req.query.yCoord_local;
        var radiusl = req.query.radius_local;
        var xCoordg = req.query.xCoord_global;
        var yCoordg = req.query.yCoord_global;
        var radiusg = req.query.radius_global;
        var userId = req.jwtUser._id;
        var result = [];

        async.waterfall([
            function (callback) {
                var currentTime = new Date().getTime();
                Message.find().where('yCoord').gt(yCoordl - radiusl).lt(yCoordl + radiusl)
                    .where('xCoord').gt(xCoordl - radiusl).lt(xCoordl + radiusl).where('time').gt(currentTime - time)
                    .exec(callback);
            },
            function (messages, callback) {
                Array.prototype.push.apply(result, messages);
                if(xCoordl !== xCoordg && yCoordg !== yCoordl && radiusg !== radiusl){
                    Message.find().where('yCoord').gt(yCoordg - radiusg).lt(yCoordg + radiusg)
                        .where('xCoord').gt(xCoordg - radiusg).lt(xCoordg + radiusg).where('time').gt(currentTime - time)
                        .exec(callback);
                } else {
                    callback(null,[]);
                }
            },
            function (messages, callback) {
                Array.prototype.push.apply(result, messages);
                var currentTime = new Date().getTime();
                Message.find({toUserId: req.jwtUser._id}).where('time').gt(currentTime - time)
                    .exec(callback);
            },
            function (messages, callback) {
                Array.prototype.push.apply(result, messages);
                ChatGroup.find({ users: userId }).exec(callback);
            },
            function (groups, callback) {
                var groupsId = [];
                var currentTime = new Date().getTime();
                groups.forEach(function(group) {
                    groupsId.push(group._id);
                });
                Message.find({chatGroupId: {$in: groupsId}}).where('time').gt(currentTime - time)
                    .exec(callback);
            },
            function (messages, callback) {
                Array.prototype.push.apply(result, messages);
                callback();
            }
        ], function (err) {
            if (err) {
                return next(err);
            }
            responseHelper.respondWithSuccess(res, result);
        });
    }


};

module.exports = helper;

