var responseHelper = require('helpers').responseHelper;

/**
 * Validates the request from get message
 *
 * @param req
 * @param next
 * @param callback
 */
exports.validate = function(req, res, next){

    req.checkBody('radius', 'Radius should be defined').notEmpty();
    req.checkBody('xCoord', 'Should have coordinates').notEmpty();
    req.checkBody('yCoord', 'Should have coordinates').notEmpty();
    req.checkBody('time', 'Should have from what time').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        responseHelper.respondWithManyErrors(res, errors, 403);
    }
    next();
};


exports.privateValidate = function(req, res, next){

    req.checkQuery('time', 'Should have from what time').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        responseHelper.respondWithManyErrors(res, errors, 403);
    }
    next();
};

exports.groupValidate = function(req, res, next){

    req.checkQuery('time', 'Should have from what time').notEmpty();
    req.checkQuery('groupId', 'Should have from what time').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        responseHelper.respondWithManyErrors(res, errors, 403);
    }
    next();
};