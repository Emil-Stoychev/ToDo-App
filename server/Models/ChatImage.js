const mongoose = require('mongoose')

const ChatImageSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: {
        type: String
    },
    thumbnail: {
        type: String
    }
},
    { timestamps: true },
)

const ChatImage = mongoose.model('ChatImage', ChatImageSchema)

exports.ChatImage = ChatImage