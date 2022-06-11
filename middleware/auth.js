const JWT = require('jsonwebtoken')
const dotenv = require('dotenv').config()

module.exports = async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = JWT.verify(token, process.env.JWT_SECRET)
            const userId = decodedToken.userId
            req.auth = { userId }
            if (req.body.userId && req.body.userId !== userId) {
            res.status(403).json({error: new Error("Id utilisateur invalide")})
            } else {
            next()
            }
        } catch {
            res.status(401).json({ error: new Error('Requête invalide') })
        }
}