/**
 * Validates the request from reset password
 *
 * @param req
 * @param res
 */
exports.validate = function ( req, res ) {

    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email does not appear to be valid').isEmail();

    var errors = req.validationErrors();

    if (errors) {
        return errors;
    }

    return true;
};


/**
 * Validation of the password from the reset handle
 *
 * @param req
 * @param res
 */
exports.validateNewPass = function(req,res) {

    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password_confirm', 'Password confirmation is required').notEmpty();
    req.checkBody('password', 'Passwords do no match').equals(req.body.password_confirm);

    var errors = req.validationErrors();

    if (errors) {
        return errors;
    }

    return true;
};