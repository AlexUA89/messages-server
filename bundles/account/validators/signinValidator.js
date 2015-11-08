/**
 * Validates the request from signin
 *
 * @param req
 * @param res
 */
exports.validate = function ( req, res ) {

    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email does not appear to be valid').isEmail();

    var errors = req.validationErrors();

    if (errors) {
        return errors;
    }

    return true;
};