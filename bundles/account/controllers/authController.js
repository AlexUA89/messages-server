var FB = require('facebook-node');
var User = require('models').User;
var ChatGroup = require('models').ChatGroup;
var jwt = require('jsonwebtoken');
var environment = require('configuration');
var googleapis = require('googleapis');
var async = require('neo-async');

var responseHelper = require('helpers').responseHelper;
var mailerHelper = require('helpers').mailerHelper;

var resetPassValidator = require('../validators/resetPassValidator');


/**
 * Action for showing home page for the auth
 *
 * @param req
 * @param res
 */
exports.indexAction = function (req, res) {

    res.render('auth/index');
};


/**
 * Action for logging user out
 *
 * @param req
 * @param res
 */
exports.logoutAction = function (req, res) {

    req.logout();
    res.redirect('/');
};


/**
 * Actions for handling logging with facebook based on access token
 *
 * @param req
 * @param res
 */
exports.facebookAction = function (req, res) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    FB.api('me', {fields: ['id', 'name', 'email'], access_token: token}, function (result) {

        if (typeof result.email === 'undefined') {
            responseHelper.respondWithOneError(res, 'Bad token provided.', 403);
        }

        User.findOne({'email': result.email}, function (err, user) {
            if (user) {
                updateFacebookUser(result, res, user, token);
            } else {
                newFacebookUser(result, res, token);
            }
        });
    });
};


/**
 * Creates new facebook user based on the reponse of facebook api
 *
 * @param result
 * @param res
 * @param token
 */
function newFacebookUser(result, res, token) {

    var newUser = new User();

    newUser.facebook.id = result.id;
    newUser.facebook.token = token;
    newUser.name = result.name;
    newUser.facebook.email = newUser.email = result.email;

    newUser.save(function (err) {
        if (err) {
            throw err;
        }
        var jwtToken = getJWTForUser(newUser);
        res.json(getCompiledUser(newUser, jwtToken));
    });
}


/**
 * Checks if user needs to be updated and returns this user
 *
 * @param result
 * @param res
 * @param user
 * @param token
 */
function updateFacebookUser(result, res, user, token) {

    if (typeof user.facebook.email === 'undefined' || typeof user.facebook.id === 'undefined' || typeof user.facebook.token === 'undefined') {

        user.facebook.id = result.id;
        user.facebook.token = token;
        user.name = result.name;
        user.facebook.email = user.email = result.email;

        user.save(function (err) {
            if (err) {
                throw err;
            }
        });
    }

    var jwtToken = getJWTForUser(user);
    res.json(getCompiledUser(user, jwtToken));
}


/**
 * Handles google login through api
 *
 * @param req
 * @param res
 */
exports.googleAction = function (req, res) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    var plus = googleapis.plus('v1');
    var OAuth2 = googleapis.auth.OAuth2;
    var oauth2Client = new OAuth2(environment.google_client_id, environment.google_client_secret, environment.google_app_callback);

    oauth2Client.setCredentials({
        access_token: token
    });

    plus.people.get({userId: 'me', auth: oauth2Client}, function (err, result) {

        if (typeof result.emails[0].value === 'undefined') {

            responseHelper.respondWithOneError(res, 'Bad token provided.', 403);
        }

        User.findOne({'email': result.emails[0].value}, function (err, user) {

            if (user) {

                updateGoogleUser(result, res, user, token);
            } else {

                createGoogleUser(result, res, token);
            }
        });
    });
};


/**
 * Create new google user
 *
 * @param result
 * @param res
 * @param token
 */
function createGoogleUser(result, res, token) {

    var newUser = new User();

    newUser.google.id = result.id;
    newUser.google.token = token;
    newUser.name = result.displayName;
    newUser.google.email = newUser.email = result.emails[0].value;

    newUser.save(function (err) {
        if (err) {
            throw err;
        }

        var jwtToken = getJWTForUser(newUser);
        res.json(getCompiledUser(newUser, jwtToken));
    });
}


/**
 * Update google user if needed or just return it's data
 *
 * @param result
 * @param res
 * @param user
 * @param token
 */
function updateGoogleUser(result, res, user, token) {

    if (typeof user.google.email === 'undefined' || typeof user.google.id === 'undefined' || typeof user.google.token === 'undefined') {

        user.google.id = result.id;
        user.google.token = token;
        user.name = result.displayName;
        user.google.email = user.email = result.emails[0].value;

        user.save(function (err) {
            if (err) {
                throw err;
            }
        });
    }
    var jwtToken = getJWTForUser(user);
    res.json(getCompiledUser(user, jwtToken));
}


/**
 * Signups user using local auth
 *
 * @param req
 * @param res
 */
exports.signupAction = function (req, res) {

    User.findOne({'name': req.body.name}, function (err, user) {

        if (!user) {

            newLocalUser(req, res);
        }
        else if (typeof user.password === 'undefined' && typeof user.confirmed === 'undefined') {

            updateLocalUser(req, res, user);
        }
        else if (user.confirmed === false) {

            mailerHelper.sendResetEmailWithToken(user, 'emails/confirmation', 'Confirmation of the email', {}, req);

            responseHelper.respondWithOneError(res, 'Go to the inbox and confirm your email.', 403);
        }
        else {

            responseHelper.respondWithOneError(res, 'User already exists.', 403);
        }
    });
};


/**
 * Update local user if it was previously logged in using social
 *
 * @param req
 * @param res
 * @param user
 */
function updateLocalUser(req, res, user) {

    var password = req.body.password;

    user.password = user.generateHash(password);
    user.confirmed = false;

    user.save(function (err) {
        if (err) {
            throw err;
        }

        mailerHelper.sendResetEmailWithToken(user, 'emails/confirmation', 'Confirmation of the email', {}, req);

        responseHelper.respondWithOneError(res, 'Looks like previously you were using social networks. You need to confirm your email now.', 403);
    });
}


/**
 * Handles creating new local user based on the params
 *
 * @param req
 * @param res
 */
function newLocalUser(req, res) {

    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;

    var user = new User();

    user.email = email;
    user.name = name;
    user.password = user.generateHash(password);
    user.confirmed = false;

    user.save(function (err) {
        if (err) {
            throw err;
        }

        mailerHelper.sendResetEmailWithToken(user, 'emails/confirmation', 'Confirmation of the email', {}, req);

        responseHelper.respondWithOneError(res, 'You need to confirm your email.', 200);
    });
}


/**
 * Signins user using local auth
 *
 * @param req
 * @param res
 */
exports.signinAction = function (req, res) {

    var email = req.body.email;
    var password = req.body.password;

    User.findOne({'email': email}, function (err, user) {

        if (!user) {

            responseHelper.respondWithOneError(res, 'No such user.', 403);
        }
        else if (user.confirmed === false) {

            mailerHelper.sendResetEmailWithToken(user, 'emails/confirmation', 'Confirmation of the email', {}, req);

            responseHelper.respondWithOneError(res, 'Go to the inbox and confirm your email.', 403);
        }
        else {
            if (user.validPassword(password)) {

                var jwtToken = getJWTForUser(user);
                res.json(getCompiledUser(user, jwtToken));
            }
            else {

                responseHelper.respondWithOneError(res, 'No such user.', 403);
            }
        }
    });
};


/**
 * Handles email confirmation
 *
 * @param req
 * @param res
 */
exports.confirmEmailAction = function (req, res) {

    var token = req.params.token;

    User.findOne({'reset_token': token}, function (err, user) {

        if (!user) {
            res.redirect('/fail');
        } else {
            user.confirmed = true;
            user.save(function (err) {

                if (err) {
                    throw err;
                }

                res.redirect('/success');
            });
        }
    });
};


/**
 * Send reset password link to user
 *
 * @param req
 * @param res
 */
exports.resetPassAction = function (req, res) {

    var email = req.body.email;

    User.findOne({'email': email}, function (err, user) {

        if (!user) {

            responseHelper.respondWithOneError(res, 'No such user.', 403);
        }
        else {

            mailerHelper.sendResetEmailWithToken(user, 'emails/reset', 'Reset of the password', {}, req);

            responseHelper.respondWithOneSuccess(res, 'Password reset link was sent to the email.');
        }
    });
};


/**
 * Shows the form for changing email
 *
 * @param req
 * @param res
 */
exports.resetPassFormAction = function (req, res) {
    res.render('auth/reset');
};


/**
 * Handles resseting the password
 *
 * @param req
 * @param res
 */
exports.resetPassHandleAction = function (req, res) {

    User.findOne({'reset_token': req.params.token}, function (err, user) {

        if (err) {
            throw err;
        }

        if (!user) {

            res.redirect('/fail');
        }
        else {

            user.password = user.generateHash(req.body.password);
            user.confirmed = true;

            user.save(function (err) {

                if (err) {
                    throw err;
                }

                res.redirect('/success');
            });
        }
    });
};


exports.getAllFriends = function (req, res) {
    var userId = req.jwtUser._id;
    User.findOne({'_id': userId}).populate('friends').exec(function (err, friends) {
        if (err) {
            responseHelper.respondWithOneError(res, err, 500);
            throw err;
        }
        responseHelper.respondWithManySuccess(res, friends);

    });
};


exports.addNewFriend = function (req, res) {
    var userId = req.jwtUser._id;
    var friendId = req.params.friendId;
    async.waterfall([
        function (callback) {
            User.findOne({'_id': userId}).exec(callback);
        },
        function (user, callback) {
            if (!!user) {
                user.addNewFriend(friendId, callback);
            }
            callback();
        }
    ], function (err, result) {
        if (err) {
            responseHelper.respondWithOneError(res, err, 500);
            throw err;
        }
        responseHelper.respondWithOneSuccess(res, 'User added');
    });
};


exports.deleteFriend = function (req, res) {
    var userId = req.jwtUser._id;
    var friendId = req.params.friendId;
    async.waterfall([
        function (callback) {
            User.findOne({'_id': userId}).exec(callback);
        },
        function (user, callback) {
            if (!!user) {
                user.removeFriend(friendId, callback);
            }
            callback();
        }
    ], function (err, result) {
        if (err) {
            responseHelper.respondWithOneError(res, err, 500);
            throw err;
        }
        responseHelper.respondWithOneSuccess(res, 'User deleted from friend list');
    });
};

exports.getUserInfo = function (req, res) {
    var userId = req.params.userId;
    User.findOne({'_id': userId}, function (err, user) {
        if (err) {
            responseHelper.respondWithOneError(res, err, 500);
            throw err;
        }
        delete user.password;
        delete user.reset_token;
        delete user.facebook;
        delete user.google;
        delete user.friends;
        responseHelper.respondWithOneSuccess(res, user);
    })
};


/**
 * Return compiled user with token after logging/registering with facebook
 *
 * @param user
 * @param token
 * @returns {*}
 */
function getCompiledUser(user, token) {

    return {
        success: true,
        data: {
            jwt_token: token,
            user_id: user._id,
            name: user.name,
            email: user.email
        }
    }
}


/**
 * Returns the user info after login(including jwt token)
 *
 * @param user
 */
function getJWTForUser(user) {

    return jwt.sign(user, environment.get('app_key'), {
        expiresInMinutes: 20160 // expires in 14 days
    });
}

/**
 *
 * @param req
 * @param res
 */
exports.getGroupInfo = function (req, res) {
    var groupId = req.params.groupId;
    ChatGroup.findOne({'_id': groupId}, function (err, user) {
        if (err) {
            responseHelper.respondWithOneError(res, err, 500);
            throw err;
        }
        responseHelper.respondWithOneSuccess(res, user);
    });
};


/**
 *
 * @param req
 * @param res
 */
exports.deleteUserFromGroup = function (req, res) {
    var groupId = req.params.groupId;
    var userId = req.params.userId;
    async.waterfall([
        function (callback) {
            ChatGroup.findOne({'_id': groupId}).exec(callback);
        },
        function (group, callback) {
            if (!!group) {
                group.removeUser(userId, callback);
            }
            callback();
        }
    ], function (err, result) {
        if (err) {
            responseHelper.respondWithOneError(res, err, 500);
            throw err;
        }
        responseHelper.respondWithOneSuccess(res, 'User deleted from group');
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.addUserFromGroup = function (req, res) {
    var groupId = req.params.groupId;
    var userId = req.params.userId;
    async.waterfall([
        function (callback) {
            ChatGroup.findOne({'_id': groupId}).exec(callback);
        },
        function (group, callback) {
            if (!!group) {
                group.addNewUser(userId, callback);
            }
            callback();
        }
    ], function (err, result) {
        if (err) {
            responseHelper.respondWithOneError(res, err, 500);
            throw err;
        }
        responseHelper.respondWithOneSuccess(res, 'User added to group');
    });
};


/**
 *
 * @param req
 * @param res
 */
exports.createGroup = function (req, res) {
    var groupName = req.params.groupName;

    var newGroup = new ChatGroup();
    newGroup.name = groupName;

    newGroup.save(function (err, group) {
        if (err) {
            responseHelper.respondWithOneError(res, err, 500);
            throw err;
        }
        responseHelper.respondWithOneSuccess(res, group);
    });
};