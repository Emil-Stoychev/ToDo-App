const mongoose = require('mongoose')

const TaskCntSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    in: {
        type: String,
        enum: ['todo', 'inProgress', 'done'],
        default: 'todo'
    }
},
    { timestamps: true },
)

const TaskCnt = mongoose.model('TaskCnt', TaskCntSchema)

exports.TaskCnt = TaskCnt