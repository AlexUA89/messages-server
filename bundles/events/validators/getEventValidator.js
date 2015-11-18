/**
 * Validates the request from getting events
 *
 * @param req
 * @param next
 * @param callback
 */
exports.validate = function (req, res, next) {

    req.checkParams('xCoord', 'Should have coordinates').notEmpty();
    req.checkParams('yCoord', 'Should have coordinates').notEmpty();
    req.checkParams('radius', 'Should have radius').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        responseHelper.respondWithError(res, errors, 403);
    }
    next();
};