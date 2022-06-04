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
        ...JSON.parse(req.body),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body}
    Sauce.updateOne({_id: ObjectId(req.params.id)}, { ...sauceObject, _id: ObjectId(req.params.id)})
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
