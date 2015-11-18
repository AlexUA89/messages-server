var responseHelper = require('helpers').responseHelper;
/**
 * Validates the request from reset password
 *
 * @param req
 * @param res
 */
exports.validate = function (req, res, next) {

    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email does not appear to be valid').isEmail();

    var errors = req.validationErrors();
    if (errors) {
        responseHelper.respondWithErrors(res, errors, 403);
    }
    next();
};


/**
 * Validation of the password from the reset handle
 *
 * @param req
 * @param res
 */
exports.validateNewPass = function(req, res, next) {

    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password_confirm', 'Password confirmation is required').notEmpty();
    req.checkBody('password', 'Passwords do no match').equals(req.body.password_confirm);

    var errors = req.validationErrors();
    if (errors) {
        res.render('auth/reset', {
            errors: errors
        });
    }
    next();
};