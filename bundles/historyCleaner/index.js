var database = require('libs/db');
var logger = require('libs/log');
var config = require('configuration');
var Message = require('models').Message;
var async = require('neo-async');
var DataManager = require('./actions/DataManager')

var cleaner = {

    init: function () {
        var self = this;
        var timerId = setTimeout(function () {
            self.workflow(function (err, result) {
                if (err) {
                    throw err;
                }
                self.init();
            });
            self.init();
        }, config.get('history_cleaner:timeout_min') * 60 * 1000).unref();
    },

    workflow: function (callback) {
        var fromTime = new Date().getTime() - config.get("history_cleaner:leave_time") * 60 * 1000;
        async.waterfall([
                function (callback) {
                    Message.find().where("time")
                        .lt(new Date(fromTime)).exec(callback);
                },
                function (messages, callback) {
                    DataManager.saveData(messages, callback);
                },
                function (messages, callback) {
                    Message.find().where("time")
                        .lt(new Date(fromTime)).remove().exec(callback);
                }
            ],
            function (err, result) {
                if (err) {
                    throw err;
                }
                logger.warn('Database cleaned');
                callback()
            });
    }
};

module.exports = cleaner;

