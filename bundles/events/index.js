var express = require('express');
var router = express.Router();
var eventsController = require('./controllers/eventsController');
var requireDir = require('require-dir');
var middlewares = requireDir('../../middlewares');
var registerEventValidator = require('./validators/registerEventValidator');
var getEventValidator = require('./validators/getEventValidator');

var eventsRouter = {

    baseRoute: "/events",

    init: function () {

        router.post('/register', middlewares.jwt.isAdmin, registerEventValidator.validate, eventsController.registerEvent);

        router.get('/getEvents', middlewares.jwt.isLoggedIn, getEventValidator.validate, eventsController.getEvents);

        return router;
    }
};


module.exports = eventsRouter;