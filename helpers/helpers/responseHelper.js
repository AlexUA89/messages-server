/**
 * Responses with error using json with code provided
 *
 * @param res
 * @param error
 * @param code
 */
exports.respondWithErrorss = function (res, errors, code) {

    res.status(code).json({
        success: false,
        errors: errors
    });
};


/**
 * Responses with one success message
 *
 * @param res
 * @param msg
 */
exports.respondWithSuccess = function (res, msg) {

    res.status(200).json({
        success: true,
        data: msg
    });
};