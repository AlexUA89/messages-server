var Event = require('models').Event;
var async = require('neo-async');
var responseHelper = require('helpers').responseHelper;
var registerEventValidator = require('../validators/registerEventValidator');
var getEventValidator = require('../validators/getEventValidator');

var manager = {

    registerEvent: function (req, res, next) {
        async.waterfall([
            function (callback) {
                registerEventValidator.validate(req, next, callback);
            },
            function (callback) {
                var event = new Event({
                    name: req.body.name,
                    description: req.body.description,
                    imageUri: req.body.imageUri,
                    timeStart: req.body.timeStart,
                    timeEnd: req.body.timeEnd,
                    xCoord: req.body.xCoord,
                    yCoord: req.body.yCoord,
                    userId: req.body.userId
                });
                event.save(callback);
            }
        ], function (err, result) {
            if (err) {
                throw err;
            }
            responseHelper.respondWithOneSuccess(res, 'Event is saved.');
        });
    },

    getEvents: function (req, res, next) {
        var xCoord = req.params.xCoord;
        var yCoord = req.params.yCoord;
        var radius = req.params.radius;
        var category = req.params.category;

        async.waterfall([
            function (callback) {
                getEventValidator.validate(req, next, callback);
            },
            function (callback) {
                var query;
                Event.find().where('yCoord').gt(yCoord - radius).lt(yCoord + radius)
                    .where('xCoord').gt(xCoord - radius).lt(xCoord + radius);
                if (!!category) {
                    query = Event.find({'category': category});
                } else {
                    query = Event.find();
                }
                query.where('yCoord').gt(yCoord - radius).lt(yCoord + radius)
                    .where('xCoord').gt(xCoord - radius).lt(xCoord + radius).exec(callback);
            },
            function (events, callback) {
                var result = [];
                events.forEach(function (event) {
                    result.push(event);
                });
                callback(null, result);
            }
        ], function (err, result) {
            if (err) {
                throw err;
            }
            responseHelper.respondWithManySuccess(res, result);
        });
    }

};

module.exports = manager;

