var WebSocketServer = require('ws').Server;
var actions = require('./actions');

var webSocket = {

    init: function(server) {

        var wss = new WebSocketServer({ server: server });

        wss.on('connection', actions.onConnection);

        wss.on('close', actions.onCloseConnection);

        wss.on('message', actions.onMessage);

        return wss;
    }

};


module.exports = webSocket;