const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username:
        {
            type: String,
            required: true,
        },
    userPassword:
        {
            type: String,
            required: true,
        },
    userEmail:
        {
            type: String,
            required: true
        }

}, {timestamps: true})

module.exports = mongoose.model('Users', UserSchema)