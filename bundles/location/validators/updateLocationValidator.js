var responseHelper = require('helpers').responseHelper;
/**
 * Validates the request from send message
 *
 * @param req
 * @param next
 * @param callback
 */
exports.validate = function (req, res, next) {

    req.checkBody('xCoord', 'xCoord should be defined').notEmpty();
    req.checkBody('yCoord', 'YCoord should be defined').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        responseHelper.respondWithErrors(res, errors, 403);
    }
    next();
};