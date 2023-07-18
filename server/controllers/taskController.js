const router = require('express').Router()

const { authMiddleware } = require('../Middlewares/authMiddleware')
const taskService = require('../Services/taskService')

router.get('/:trainingId', async (req, res) => {
    let trainingProgram = await taskService.getById(req.params.trainingId)

    res.json(trainingProgram?._id ? trainingProgram : { message: "Empty" })
})


router.post('/create', authMiddleware, async (req, res) => {
    let createdProgram = await taskService.create(req.body.data.mainInputTitle, req.body.data.container, req.body.data.category, req.params?.user?._id, req.body.data.visible, req.body.data?.price, req.body.data?.currency) || []

    res.json(createdProgram)
})

module.exports = router