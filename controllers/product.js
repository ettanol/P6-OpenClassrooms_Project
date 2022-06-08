const Sauce = require('../models/product')
const fs = require('fs')

exports.addSauce = async (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
   const product = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
   })
   product.save()
   .then(() => res.status(201).json({message: 'objet enregistré'}))
   .catch(error => res.status(400).json({error}))
}

exports.updateSauce = async (req, res, next)=> {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body}
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message: 'sauce modifiée'}))
    .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = async (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(product => {
        const filename = product.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, ()=> {
            Sauce.deleteOne({ _id: req.params.id})
            .then(()=> res.status(200).json({ message: 'sauce supprimée!' }))
            .catch(error => res.status(400).json( {error}))
        })
    })
    .catch(error => res.status(500).json({error}))
}

exports.getOneSauce = async (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(product => res.status(200).json(product))
    .catch(error => res.status(404).json({ error}))
}

exports.getAllSauces = async (req, res, next) => {
    Sauce.find()
    .then(products => res.status(200).json(products))
    .catch(error => res.status(400).json({ error }))
}


exports.likeOneSauce = async (req, res, next) => {
    let body = req.body
    let like = body.like
    let countOfUsersLiked = 0
    let countOfUsersDisliked = 0
    
    Sauce.findOne({ _id: req.params.id})
    .then(product => {
        let usersLiked = product.usersLiked
        let usersDisliked = product.usersDisliked

        let add = (user) => {
            countOfUsersLiked = user.push(req.body.userId)
            user == usersLiked? product.likes++ : product.dislikes++
        }
        let remove = (user) => {
            let index = user.indexOf(req.body.userId)
            if(user == usersLiked){
                user.splice(index, 1)
                return product.likes--
            } else {
                user.splice(index, 1)
                return product.dislikes--
            }
        }

        if(like == -1){
            !usersDisliked.includes(req.body.userId)? 
            add(usersDisliked) : remove(usersLiked)
        } else if(like == 0) {
            if(usersDisliked.includes(req.body.userId)) {
                remove(usersDisliked) 
            } else if (usersLiked.includes(req.body.userId)){
                remove(usersLiked)
            }
        } else {
            usersDisliked.includes(req.body.userId)?
                remove(usersDisliked) : add(usersLiked)
        }
        body = product
        Sauce.updateOne({ _id: req.params.id}, { body, _id: req.params.id})
        .then(() => res.status(200).json({message: 'avis ajouté'}))
        .catch(error => res.status(400).json({ error }))
    })
}
