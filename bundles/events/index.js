var express = require('express');
var router = express.Router();
var eventsController = require('./controllers/eventsController');
var requireDir = require('require-dir');
var middlewares = requireDir('../../middlewares');

var eventsRouter = {

    baseRoute: "/events",

    init: function () {

        router.post('/register', middlewares.jwt.isAdmin, eventsController.registerEvent);

        router.get('/getEvents', middlewares.jwt.isLoggedIn, eventsController.getEvents);

        return router;
    }
};


module.exports = eventsRouter;