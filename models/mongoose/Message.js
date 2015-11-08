// load the things we need
var mongoose = require('libs/db'),
    Schema = mongoose.Schema;

// define the schema for our user model
var messageSchema = new Schema({

    message: {
        type: String,
        //unique: true,
        required: true
    },

    xCoord: {
        type: Number
    },

    yCoord: {
        type: Number
    },

    toUserId: {
        type:String
    },

    chatGroupId: {
        type:String
    },

    userId: {
        type: String,
        required: true
    },

    time: {
        type: Date,
        required: true
    }

});


module.exports = mongoose.model('Message', messageSchema);