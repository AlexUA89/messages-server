/**
 * Responses with error using json with code provided
 *
 * @param res
 * @param error
 * @param code
 */
exports.respondWithOneError = function ( res, error, code ) {

    res.status( code ).json( {
        success: false,
        errors: [
            {
                msg: error
            }
        ]
    } );
};


/**
 * Responses with multiple error using json with code provided
 *
 * @param res
 * @param errors
 * @param code
 */
exports.respondWithManyErrors = function ( res, errors, code ) {

    res.status( code ).json( {
        success: false,
        errors: errors
    } );
};


/**
 * Responses with one success message
 *
 * @param res
 * @param msg
 */
exports.respondWithOneSuccess = function ( res, msg ) {

    res.status( 200 ).json( {
        success: true,
        data:
            {
                msg: msg
            }
    } );
};

/**
 * Responses with many success messages
 *
 * @param res
 * @param msg
 */
exports.respondWithManySuccess = function ( res, msg ) {

    res.status( 200 ).json( {
        success: true,
        data: msg
    } );
};