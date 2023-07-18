const jwt = require('jsonwebtoken')

let sessionName = 'sessionStorage'
let secret = process.env.secret

async function authMiddleware(req, res, next) {
    try {
        let info = jwt.verify(req.params.token || req.body.token, secret)

        req.params.user = info

        next()
    } catch (error) {
        return res.status(403).send({
            message: 'Unauthorized!'
        })
    }
}

module.exports = {
    authMiddleware
}