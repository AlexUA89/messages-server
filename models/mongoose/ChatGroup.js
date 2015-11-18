// load the things we need
var mongoose = require('libs/db'),
    Schema = mongoose.Schema;

// define the schema for our user model
var chatGroupSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    users: [{type: Schema.Types.ObjectId, ref: 'User'}]

});

chatGroupSchema.methods.addNewUser = function (userId, callback) {
    this.users.push(userId);
    this.save(callback);
};

chatGroupSchema.methods.getAllUsers = function (callback) {
    this.findOne({'_id': this._id}).populate('users').exec(callback);
};

chatGroupSchema.methods.removeUser = function (friendId, callback) {
    this.friends.pull(friendId);
    this.save(callback);
};

chatGroupSchema.methods.getAllMyGroups = function (userId, callback) {
    this.find({ users: userId }).exec(callback);
};

module.exports = mongoose.model('ChatGroup', chatGroupSchema);