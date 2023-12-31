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

router.get('/getTask/:taskId/:token', authMiddleware, async (req, res) => {
    let task = await taskService.getCurrentTask(req.params.taskId, req.params.user._id)

    res.json(task)
})

router.get('/getCurrentTaskHistory/:taskId/:skipNum/:token', authMiddleware, async (req, res) => {
    let taskHistory = await taskService.getCurrentTaskHistory(req.params.taskId, req.params.skipNum, req.params.user._id)

    res.json(taskHistory)
})


router.post('/createNewMain/:token', authMiddleware, async (req, res) => {
    let createdNewMain = await taskService.createNewMain(req.body.value, req.params?.user?._id)

    res.json(createdNewMain)
})

router.post('/createTask/:token', authMiddleware, async (req, res) => {
    let createdTask = await taskService.createTask(req.body.value, req.body.priority, req.body.taskId, req.params?.user?._id)

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

router.put('/changePriority/:taskId/:token', authMiddleware, async (req, res) => {
    let changedTask = await taskService.changePriority(req.params.taskId, req.params?.user?._id)

    res.json(changedTask)
})

router.put('/addOrRemoveAdmin/:userId/:mainId/:token', authMiddleware, async (req, res) => {
    let changedTask = await taskService.addOrRemoveAdmin(req.params.userId, req.params.mainId, req.params?.user?._id)

    res.json(changedTask)
})

router.put('/addOrRemoveUser/:token', authMiddleware, async (req, res) => {
    let editedTask = await taskService.addOrRemoveUser(req.body?.userId, req.body.mainId, req.params?.user?._id)

    res.json(editedTask)
})

router.delete('/deleteTask/:taskId/:mainTaskId/:token', authMiddleware, async (req, res) => {
    let deletedTask = await taskService.deleteTask(req.params.taskId, req.params.mainTaskId, req.params?.user?._id)

    res.json(deletedTask)
})

router.delete('/deleteMainTask/:mainTaskId/:token', authMiddleware, async (req, res) => {
    let deletedTask = await taskService.deleteMainTask(req.params.mainTaskId, req.params?.user?._id)

    res.json(deletedTask)
})

module.exports = router