/**
 * Validates the request from send message
 *
 * @param req
 * @param next
 * @param callback
 */
exports.validate = function (req, next, callback) {

    req.checkBody('message', 'Message is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        next(errors);
    }
    callback();
};