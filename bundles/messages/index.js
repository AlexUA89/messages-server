var express = require('express');
var router = express.Router();
var messageController = require('./controllers/messageController');
var requireDir = require('require-dir');
var middlewares = requireDir('../../middlewares');

var messagesRouter = {

    baseRoute: "/messages",

    init: function () {

        router.post('/send', middlewares.jwt.isLoggedIn, messageController.sendMessage);

        router.get('/get', middlewares.jwt.isLoggedIn, messageController.getMessages);

        router.get('/getPrivate', middlewares.jwt.isLoggedIn, messageController.getPrivateMessages);

        router.get('/getGroup', middlewares.jwt.isLoggedIn, messageController.getGroupsMessages);

        return router;
    }
};


module.exports = messagesRouter;