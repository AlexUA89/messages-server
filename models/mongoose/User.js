// load the things we need
var mongoose = require('libs/db'),
    Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var randomstring = require("randomstring");

// define the schema for our user model
var userSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        //unique: true,
        required: true
    },
    password: {
        type: String
    },
    confirmed: {
        type: Boolean
    },
    reset_token: {
        type: String
    },
    facebook: {
        id: String,
        token: String,
        email: String
    },
    google: {
        id: String,
        token: String,
        email: String
    },
    friends: [{type: Schema.Types.ObjectId, ref: 'User'}]
});


/**
 * Generating hash from the password
 *
 * @param password
 * @returns {*}
 */
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


/**
 * Checking if pass is valid for the user
 *
 * @param password
 * @returns {*}
 */
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


/**
 * Returns unique random confirm token
 *
 * @returns {*}
 */
userSchema.statics.generateConfirmToken = function (user, callback) {
    var self = this;

    function uniqueToken(callback) {
        var token = randomstring.generate(255);

        self.findOne({'reset_token': token}, function (err, newUser) {
            if (!newUser) {

                user.reset_token = token;
                user.save(function (err) {

                    if (err) {
                        callback(err, null);
                    }

                    callback(token);
                });
            }
            else {
                uniqueToken(callback);
            }
        });
    }

    uniqueToken(function (token) {
        callback(token);
    });

};

userSchema.methods.addNewFriend = function (friendId, callback) {
    this.friends.push(friendId);
    this.save(callback);
};

userSchema.methods.getAllFriends = function (callback) {
    this.findOne({'_id': this._id}).populate('friends').exec(callback);
};

userSchema.methods.removeFriend = function (friendId, callback) {
    this.friends.pull(friendId);
    this.save(callback);
};


module.exports = mongoose.model('User', userSchema);