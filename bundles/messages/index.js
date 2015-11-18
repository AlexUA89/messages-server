var express = require('express');
var router = express.Router();
var messageController = require('./controllers/messageController');
var requestGetMessValidator = require('./validators/requestGetMessValidator');
var requestSendMessValidator = require('./validators/requestSendMessValidator');
var requireDir = require('require-dir');
var loginChecker = requireDir('../../middlewares');

var messagesRouter = {

    baseRoute: "/messages",

    init: function () {

        router.post('/send', loginChecker.jwt.isLoggedIn, requestSendMessValidator.validate, messageController.sendMessage);

        router.get('/get_local', loginChecker.jwt.isLoggedIn, requestGetMessValidator.validate, messageController.getMessages);

        router.get('/getPrivate', loginChecker.jwt.isLoggedIn, requestGetMessValidator.privateValidate, messageController.getPrivateMessages);

        router.get('/getGroup', loginChecker.jwt.isLoggedIn, requestGetMessValidator.groupValidate , messageController.getGroupsMessages);

        router.get('/get_all_messages', loginChecker.jwt.isLoggedIn, requestGetMessValidator.getAllValidate , messageController.getAllMessages);

        return router;
    }
};


module.exports = messagesRouter;