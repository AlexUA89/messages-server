/**
 * Responses with error using json with code provided
 *
 * @param res
 * @param error
 * @param code
 */
exports.respondWithErrors = function (socket, errors) {
    socket.send(JSON.stringify({
        success: false,
        errors: errors
    }));
};


/**
 * Responses with one success message
 *
 * @param res
 * @param msg
 */
exports.sendData = function (socket, msg) {
    socket.send(JSON.stringify({
        success: true,
        data: msg
    }));
};
