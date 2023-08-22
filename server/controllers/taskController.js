const router = require('express').Router()

const { authMiddleware } = require('../Middlewares/authMiddleware')
const taskService = require('../Services/taskService')

router.get('/:taskId', async (req, res) => {
    let task = await taskService.getById(req.params.trainingId)

    res.json(task?._id ? task : { message: "Empty" })
})

router.get('/:token/:userId', async (req, res) => {
    let tasks = await taskService.getALlTasks(req.params.userId)

    res.json(tasks)
})

router.get('/getTask/:taskId/:token',authMiddleware, async (req, res) => {
    let task = await taskService.getCurrentTask(req.params.taskId, req.params.user._id)

    res.json(task)
})


router.post('/createNewMain/:token', authMiddleware, async (req, res) => {
    let createdNewMain = await taskService.createNewMain(req.body.value, req.params?.user?._id)

    res.json(createdNewMain)
})

router.post('/createTask/:token', authMiddleware, async (req, res) => {
    let createdTask = await taskService.createTask(req.body.value, req.body.taskId, req.params?.user?._id)

    res.json(createdTask)
})

router.put('/editTask/:token', authMiddleware, async (req, res) => {
    let editedTask = await taskService.editTask(req.body.taskId, req.body.value, req.params?.user?._id)

    res.json(editedTask)
})

router.put('/moveTask/:taskId/:mainId/:num/:token', authMiddleware, async (req, res) => {
    let movedTask = await taskService.moveTask(req.params.taskId, req.params.mainId, req.params.num, req.params?.user?._id)

    res.json(movedTask)
})

router.delete('/deleteTask/:taskId/:mainTaskId/:token', authMiddleware, async (req, res) => {
    let deletedTask = await taskService.deleteTask(req.params.taskId, req.params.mainTaskId, req.params?.user?._id)

    res.json(deletedTask)
})

module.exports = router