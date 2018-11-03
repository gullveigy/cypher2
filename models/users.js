let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
        username: { type:String, unique:true, required: true, writable: false},
        password: { type:String, unique:true, required: true, writable: false,},
        profile:{ gender: String,
            email: String,
            phone: String
        },
    },
    { collection: 'userdb' });

module.exports = mongoose.model('User', UserSchema);
