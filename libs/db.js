var database = require('mongoose');
var config = require('configuration');

var db = database.connect(config.get('mongoose:uri'), config.get("mongoose:options")).connection;

//db.on('error', function(err) { console.log(err.message); });
db.once('open', function() {
    console.log("mongodb connection open");
});

module.exports = database;