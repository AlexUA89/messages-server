var logger =  require('libs/log');
/**
 * Validates the request from get message
 *
 * @param req
 * @param next
 * @param callback
 */
exports.validate = function(req, next, callback){

    req.checkBody('radius', 'Radius should be defined').notEmpty();
    req.checkBody('xCoord', 'Should have coordinates').notEmpty();
    req.checkBody('yCoord', 'Should have coordinates').notEmpty();
    req.checkBody('time', 'Should have from what time').notEmpty();
    req.checkBody('toUserId', 'User should be define').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return next(errors);
    }
    callback();
};


exports.privateValidate = function(req, next, callback){

    req.checkQuery('time', 'Should have from what time').notEmpty();
    logger.crit('privateValidate checking');
    var errors = req.validationErrors();
    logger.crit('privateValidate errors '+ errors);
    if (errors) {
        return next(errors);
        logger.crit('privateValidate error');
    }
    callback();
};

exports.groupValidate = function(req, next, callback){

    req.checkQuery('time', 'Should have from what time').notEmpty();
    req.checkQuery('groupId', 'Should have from what time').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return next(errors);
    }
    callback();
};