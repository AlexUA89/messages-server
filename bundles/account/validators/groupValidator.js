var responseHelper = require('helpers').responseHelper;

exports.validateCreating = function(req, res, next){

    req.checkQuery('group_name', 'Group name should be defined').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        responseHelper.respondWithError(res, errors, 403);
    }
    next();
};