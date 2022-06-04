const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const User = require('../models/user')

exports.signup = async (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
    const user = new User({
        email: req.body.email,
        password: hash
    })
    user.save()
    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
    .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}

exports.login= async (req, res, next) => {
    User.findOne({ email: req.body.email})
    .then(user => {
        if(!user) {
            return res.status(401).json({error: 'Utilisateur non trouvé'})
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({error: 'mot de passe incorrect'})
            }
            res.status(200).json({
                userId : user._id,
                token: JWT.sign(
                    { userId: user._id},
                    process.env.JWT_SECRET,
                    { expiresIn: '24h'}
                )
            })
        })
        .catch(error => res.status(500).json({error}))
    })
    .catch(error => res.status(500).json({error}))
}