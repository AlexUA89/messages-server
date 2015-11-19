var async = require('neo-async');
var responseHelper = require('helpers').responseHelper;
var UserLocation = require('models').UserLocation;

var controller = {

    sendLocation: function (req, res, next) {
        async.waterfall([
            function (callback) {
                var location = new UserLocation({
                    xCoord: req.body.xCoord,
                    yCoord: req.body.yCoord,
                    userId: req.jwtUser._id
                });
                location.save(callback);
            }
        ], function (err, result) {
            if (err) {
                throw err;
            }
            responseHelper.respondWithSuccess(res, result);
        });
    }
};

module.exports = controller;

