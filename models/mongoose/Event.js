
var mongoose = require('libs/db'),
    Schema = mongoose.Schema;

var eventSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUri: {
      type:String
    },
    xCoord: {
        type: Number,
        required: true
    },
    yCoord: {
        type: Number,
        required: true
    },
    timeStart: {
        type: Date,
        required: true
    },
    timeEnd: {
        type: Date,
        required: true
    },
    userId: {
        type: String
    },
    category: {
        type: String,
        required: true
    }

});


module.exports = mongoose.model('Event', eventSchema);