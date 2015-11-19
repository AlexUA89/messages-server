// load the things we need
var mongoose = require('libs/db'),
    Schema = mongoose.Schema;

// define the schema for our user model
var location = new Schema({

    xCoord: {
        type: Number,
        required: true
    },

    yCoord: {
        type: Number,
        required: true
    },

    userId: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('UserLocation', location);