const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const passwordValidator = require('password-validator')
const dotenv = require('dotenv').config()

const User = require('../models/user')

exports.signup = async (req, res, next) => {
    const passwordSchema = new passwordValidator()
    passwordSchema
    .is().min(8, 'le mot de passe doit contenir 8 caractères minimum') // Minimum length 8
    .is().max(100, 'le mot de passe doit contenir 100 caractères maximum') // Maximum length 100
    .has().uppercase(1, 'le mot de passe doit contenir au moins une majuscule') // Must have uppercase letters
    .has().lowercase(1, 'le mot de passe doit contenir au moins une minuscule') // Must have lowercase letters
    .has().digits(2, 'le mot de passe doit contenir au moins deux chiffres') // Must have at least 2 digits
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123', 'Password', 'Motdepasse', '12345678', '123456789']) // Blacklist these values
    if(passwordSchema.validate(req.body.password)){
        bcrypt.genSalt(process.env.saltrounds, async (err, salt) => {
            await bcrypt.hash(req.body.password, process.env.salt)
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
        })
    } else {
        console.log(passwordSchema.validate(req.body.password, {details: true}))
        // .then(details => {
        //     console.log(details)
        //     res.status(403).json({error: details})
        // })
        res.status(403).json({error})
    }
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