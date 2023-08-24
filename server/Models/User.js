const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    username: {
        type: String,
        required: [true, 'Username is required!']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    verification: String,
    image: String,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    foreignTask: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    chat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
},
    { timestamps: true },
)

const User = mongoose.model('User', userSchema)

exports.User = User