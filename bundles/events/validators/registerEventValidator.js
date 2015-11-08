/**
 * Validates the request from registering event
 *
 * @param req
 * @param next
 * @param callback
 */
exports.validate = function (req, next, callback) {

    req.checkBody('name', 'Name of event is required').notEmpty();
    req.checkBody('xCoord', 'Should have coordinates').notEmpty();
    req.checkBody('yCoord', 'Should have coordinates').notEmpty();
    req.checkBody('description', 'Description of event is required').notEmpty();
    req.checkBody('imageUri', 'ImageUri of event is required').notEmpty();
    req.checkBody('timeStart', 'TimeStart of event is required').notEmpty();
    req.checkBody('timeEnd', 'TimeEnd of event is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return next(errors);
    }

    callback();
};