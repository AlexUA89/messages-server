var frequencySocketPingMessage = require( 'configuration').get('clientConfig:frequencySocketPingMessage');
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

exports.sendDataToMaty = function (socketsContainer, users, msg) {
    var time = new Date().getTime();
    users.forEach(function (user) {
        var connection = socketsContainer[user];
        if(connection.pingTime < (time - frequencySocketPingMessage*1000)){
            delete socketsContainer[user];
            connection.close();
        } else {
            connection.send(JSON.stringify({
                success: true,
                data: msg
            }));
        }
    });
};
