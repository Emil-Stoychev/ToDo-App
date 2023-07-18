const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    todo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaskCnt' }],
    inProgress: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaskCnt' }],
    done: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaskCnt' }],
    mainTitle: String,
    category: {
        type: String
    },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
},
    { timestamps: true },
)

const Task = mongoose.model('Task', taskSchema)

exports.Task = Task