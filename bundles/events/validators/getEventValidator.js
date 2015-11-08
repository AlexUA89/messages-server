/**
 * Validates the request from getting events
 *
 * @param req
 * @param next
 * @param callback
 */
exports.validate = function (req, next, callback) {

    req.checkParams('xCoord', 'Should have coordinates').notEmpty();
    req.checkParams('yCoord', 'Should have coordinates').notEmpty();
    req.checkParams('radius', 'Should have radius').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return next(errors);
    }
    callback();
};