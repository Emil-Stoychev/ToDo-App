const mongoose = require('mongoose')

const TaskCntSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    in: {
        type: String,
        enum: ['todo', 'inProgress', 'done'],
        default: 'todo'
    },
    history: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          action: String,
          createdAt: {
            type: Date, default: Date.now
          }
        }
      ],
    workOnIt: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},
    { timestamps: true },
)

const TaskCnt = mongoose.model('TaskCnt', TaskCntSchema)

exports.TaskCnt = TaskCnt