var Event = require('models').Event;
var async = require('neo-async');
var responseHelper = require('helpers').responseHelper;

var manager = {

    registerEvent: function (req, res, next) {
        async.waterfall([
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
        var xCoord = req.query.xCoord;
        var yCoord = req.query.yCoord;
        var radius = req.query.radius;
        var category = req.query.category;

        async.waterfall([
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

