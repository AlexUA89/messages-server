var express = require('express');
var router = express.Router();
var updateLocationController = require('./controllers/updateLocationController');
var updateLocationValidator = require('./validators/updateLocationValidator');
var requireDir = require('require-dir');
var loginChecker = requireDir('../../middlewares');

var locationRouter = {

    baseRoute: "/location",

    init: function () {

        router.post('/update', loginChecker.jwt.isLoggedIn, updateLocationValidator.validate, updateLocationController.sendLocation);

        return router;
    }
};


module.exports = locationRouter;