// load the things we need
var mongoose = require('libs/db'),
    Schema = mongoose.Schema;

// define the schema for our user model
var messageSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    users: [{type: Schema.Types.ObjectId, ref: 'User'}]

});

messageSchema.methods.addNewUser = function (userId, callback) {
    this.users.push(userId);
    this.save(callback);
};

messageSchema.methods.getAllUsers = function (callback) {
    this.findOne({'_id': this._id}).populate('users').exec(callback);
};

messageSchema.methods.removeUser = function (friendId, callback) {
    this.friends.pull(friendId);
    this.save(callback);
};


module.exports = mongoose.model('ChatGroup', messageSchema);