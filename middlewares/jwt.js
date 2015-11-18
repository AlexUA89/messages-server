var jwt = require('jsonwebtoken');
var environment = require('configuration');
var responseHelper = require('../helpers/index').responseHelper;


/**
 * Checks if user logged in based on the jwt token
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.isLoggedIn = function (req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, environment.get('app_key'), function (err, decoded) {
            if (err) {

                responseHelper.respondWithErrors(res, 'Failed to authenticate token.', 403);
            } else {
                // if everything is good, save to request for use in other routes
                req.jwtUser = decoded;
                next();
            }
        });
    } else {
        responseHelper.respondWithErrors(res, 'No token provided.', 403);
    }
};

exports.isAdmin = function(req, res, next) {
    return next();
};