var responseHelper = require('helpers').responseHelper;
/**
 * Validates the request from signin
 *
 * @param req
 * @param res
 */
exports.validate = function (req, res, next) {

    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email does not appear to be valid').isEmail();

    var errors = req.validationErrors();
    if (errors) {
        responseHelper.respondWithErrors(res, errors, 403);
    } else next();
};