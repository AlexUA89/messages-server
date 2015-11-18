var responseHelper = require('helpers').responseHelper;
/**
 * Validates the request from send message
 *
 * @param req
 * @param next
 * @param callback
 */
exports.validate = function (req, res, next) {

    req.checkBody('message', 'Message is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        responseHelper.respondWithErrors(res, errors, 403);
    }
    next();
};