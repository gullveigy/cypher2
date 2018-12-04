let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
        email: String,
        password: String
    },
    { collection: 'userdb' });

module.exports = mongoose.model('User', UserSchema);
