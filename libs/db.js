var database = require('mongoose');
var config = require('configuration');

database.connect(config.get('mongoose:uri'), config.get("mongoose:options"));

module.exports = database;