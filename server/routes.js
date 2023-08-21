const router = require('express').Router()

const authController = require('./controllers/authController')
const chatController = require('./controllers/chatController')
const taskController = require('./controllers/taskController')
const errorController = require('./controllers/errorController.js')

router.use('/users', authController)
router.use('/tasks', taskController)
router.use('/chat', chatController)
router.use('/training', taskController)

router.use('*', errorController)

module.exports = router