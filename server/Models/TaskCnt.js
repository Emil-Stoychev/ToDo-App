const mongoose = require('mongoose')

const TaskCntSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
},
    { timestamps: true },
)

const TaskCnt = mongoose.model('TaskCnt', TaskCntSchema)

exports.TaskCnt = TaskCnt