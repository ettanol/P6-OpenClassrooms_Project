const JWT = require('jsonwebtoken')
const dotenv = require('dotenv').config()

module.exports = async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1] //seperates the token from Bearer and get the token
            const decodedToken = JWT.verify(token, process.env.JWT_SECRET) //verifies if the token is correct
            const userId = decodedToken.userId
            req.auth = { userId } //creates a params to verify the userId
            if (req.body.userId && req.body.userId !== userId) {
            res.status(403).json({error: new Error("Id utilisateur invalide")})
            } else {
            next()
            }
        } catch {
            res.status(401).json({ error })
        }
}