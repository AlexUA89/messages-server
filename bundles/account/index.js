var express = require('express');
var router = express.Router();
var authController = require('./controllers/authController.js');
var requireDir = require( 'require-dir' );
var middlewares = requireDir('../../middlewares');

var accountRouter = {

    baseRoute: "/auth",

    init: function (app) {

        router.post('/facebook', authController.facebookAction);

        router.post('/google', authController.googleAction);

        router.post('/signup', authController.signupAction);

        router.post('/signin', authController.signinAction);

        router.post('/reset', authController.resetPassAction);

        router.get('/all_friends', middlewares.jwt.isLoggedIn, authController.getAllFriends);

        router.get('/add_friend/:friendId', middlewares.jwt.isLoggedIn, authController.addNewFriend);

        router.get('/delete_friend/:friendId', middlewares.jwt.isLoggedIn, authController.deleteFriend);

        router.get('/get_user_info/:userId', middlewares.jwt.isLoggedIn, authController.getUserInfo);

        router.get('/group_info/:groupId', middlewares.jwt.isLoggedIn, authController.getGroupInfo);

        router.get('/group_delete_user/:groupId/:userId', middlewares.jwt.isLoggedIn, authController.deleteUserFromGroup);

        router.get('/group_add_user/:groupId/:userId', middlewares.jwt.isLoggedIn, authController.addUserFromGroup);

        // the secured route only for authenticated users, just for test
        router.get('/secured-auth', middlewares.auth.isLoggedIn, function (req, res) {
            res.send('You\re logged in using session auth.');
        });

        // the secured route only for authenticated users using jwt, just for test
        router.post('/secured-jwt', middlewares.jwt.isLoggedIn, function (req, res) {
            res.json({
                success: true,
                message: 'You\'re logged in using jwt.',
                user: req.jwtUser
            });
        });

        router.get('/confirm/:token', authController.confirmEmailAction);
        router.get('/reset/:token', authController.resetPassFormAction);
        router.post('/reset/:token', authController.resetPassHandleAction);

        return router;
    }
};


module.exports = accountRouter;