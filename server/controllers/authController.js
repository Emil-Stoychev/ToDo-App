const router = require('express').Router()
const { authMiddleware } = require('../Middlewares/authMiddleware')

const authService = require('../Services/authService')

router.get('/', authMiddleware, async (req, res) => {
    res.json(await authService.getAll())
})

router.get('/:token/:userId', authMiddleware, async (req, res) => {
    if (req.params.userId != 'undefined' && req.params.userId != undefined) {
        res.json(await authService.getUserById(req.params.userId))
    } else {
        res.json(await authService.getUserById(req.params.user?._id))
    }
})

router.get('/:token', authMiddleware, async (req, res) => {
    res.json(await authService.getUserById(req.params.user?._id))
})

router.get('/getUserByUsernames/:token/:searchValue', authMiddleware, async (req, res) => {
    res.json(await authService.getUserByUsernames(req.params.searchValue))
})

router.get('/toggleFollow/:token/:userId', authMiddleware, async (req, res) => {
    res.json(await authService.toggleFollowPerson(req.params.userId, req.params.user?._id))
})

router.put('/editProfile/:userId', authMiddleware, async (req, res) => {
    let updatedUser = await authService.editProfile(req.body)

    res.json(updatedUser)
})

router.post('/login', async (req, res) => {
    let result = await authService.login(req.body)

    res.json(result)
})

router.post('/register', async (req, res) => {
    let registeredUser = await authService.register(req.body)

    res.json(registeredUser)
})

router.get('/logout/:token', (req, res) => {
    authService.logout(req.params.token)

    res.json({ message: "Successfully logout!" })
})

router.delete('/deleteAccount/:token', authMiddleware, async (req, res) => {
    let deletedAccount = await authService.deleteAcc(req.body.password, req.params.user._id)

    res.json(deletedAccount)
})

module.exports = router