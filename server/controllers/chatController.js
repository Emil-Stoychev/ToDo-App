const router = require('express').Router()
const { authMiddleware } = require('../Middlewares/authMiddleware')
const { createChat, userChats, findChat, addMessage, getMessages, deleteMessage, getFullImage} = require('../Services/chatService')

router.post('/', authMiddleware, async (req, res) => {
    let result = await createChat(req.body.senderId, req.body.receiverId)

    return res.status(200).json(result) || res.status(500).json(result)
})

router.get('/:userId', async (req, res) => {
    let result = await userChats(req.params.userId)

    return res.status(200).json(result) || res.status(500).json(result)
})
router.get('/find/:firstId/:secondId', async (req, res) => {
    let result = await findChat(req.params.firstId, req.params.secondId)

    return res.status(200).json(result) || res.status(500).json(result)
})

router.post('/message', authMiddleware, async (req, res) => {
    let result = await addMessage(req.body.message.chatId, req.body.message.senderId, req.body.message.text, req.body.message.image)

    return res.status(200).json(result) || res.status(500).json(result)
})
router.get('/message/:chatId/:skipNumber', async (req, res) => {
    let result = await getMessages(req.params.chatId, req.params.skipNumber)

    return res.status(200).json(result) || res.status(500).json(result)
})

router.delete('/deleteMessage/:messageId', authMiddleware, async (req, res) => {
    let deletedMessage = await deleteMessage(req.params.messageId, req.params.user._id) || { message: "404 Not found!" }

    res.json(deletedMessage)
})

router.get('/:imageId/:token', authMiddleware, async (req, res) => {
    let result = await getFullImage(req.params.imageId)

    return res.status(200).json(result) || res.status(500).json(result)
})

module.exports = router
