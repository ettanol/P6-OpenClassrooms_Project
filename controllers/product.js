const Sauce = require('../models/product')
const fs = require('fs')

exports.addSauce = async (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce) //get the req sent from the front
    delete sauceObject._id //deletes the id automatically created (to link the object to the userId)
    if(sauceObject.name.includes("<" || "javascript" || "script")
        || sauceObject.manufacturer.includes("<" || "javascript" || "script")
        || sauceObject.description.includes("<" || "javascript" || "script")
        || sauceObject.mainPepper.includes("<" || "javascript" || "script")
    ) {
        return res.status(403).json({error: "Requête refusée"}) //to protect from scripts being added
    }
    const product = new Sauce({ // creates a new object
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    })
    product.save() //saves the new object to the DB
    .then(() => res.status(201).json({message: 'objet enregistré'}))
    .catch(error => res.status(400).json({error}))
}

exports.updateSauce = async (req, res, next)=> {
    Sauce.findOne({ _id: req.params.id}) //gets the sauce that will be modified from DB
    .then(product => {
        const filename = product.imageUrl.split('/images/')[1]
        if (fs.existsSync(`images/${filename}`) && req.file){ //if the file already exists and a file is added in the request
            fs.unlink(`images/${filename}`, err => {if(err) { throw err}}) //deletes the file from the server
        }
        const sauceObject = req.file ? { //if a file is added
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //get the req and the infos of the file
        } : { ...req.body} //else just get the modified info from request
        if(sauceObject.name.includes("<" || "javascript" || "script")
        || sauceObject.manufacturer.includes("<" || "javascript" || "script")
        || sauceObject.description.includes("<" || "javascript" || "script")
        || sauceObject.mainPepper.includes("<" || "javascript" || "script")
    ) {
        return res.status(403).json({error: "Requête refusée"}) //to protect from scripts being added
    }
        Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id}) //updates DB
        .then(() => res.status(200).json({message: 'sauce modifiée'}))
        .catch(error => res.status(400).json({ error }))
    })
}

exports.deleteSauce = async (req, res, next) => {
    Sauce.findOne({ _id: req.params.id}) //checks the DB for specific object
    .then(product => {
        const filename = product.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, ()=> { //deletes the file from server
            Sauce.deleteOne({ _id: req.params.id}) //deletes the object from DB
            .then(()=> res.status(200).json({ message: 'sauce supprimée!' }))
            .catch(error => res.status(400).json({error}))
        })
    })
    .catch(error => res.status(500).json({error}))
}

exports.getOneSauce = async (req, res, next) => {//get the specific object from DB
    Sauce.findOne({ _id: req.params.id})
    .then(product => res.status(200).json(product))
    .catch(error => res.status(404).json({ error}))
}

exports.getAllSauces = async (req, res, next) => { // get all object
    Sauce.find()
    .then(products => res.status(200).json(products))
    .catch(error => res.status(400).json({ error }))
}

exports.likeOneSauce = async (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    Sauce.findOne({ _id: req.params.id}) //gets the specific object from DB
    .then(product => {
        let usersLiked = product.usersLiked
        let usersDisliked = product.usersDisliked

        let add = (user) => { //adds the user to DB and adds a like or dislike to DB
            user.push(userId)
            user == usersLiked? product.likes++ : product.dislikes++
        }
        let remove = (user) => { //removes the user to DB and removes a like or dislike to DB
            let index = user.indexOf(userId)
            user.splice(index, 1)
            user == usersLiked ? product.likes-- : product.dislikes--
        }

        if([like] == -1){ //prevent user from adding a dislike and a like at the same time
            if(!usersDisliked.includes(userId)){ 
            add(usersDisliked)
            } 
            if (usersLiked.includes(userId)){
                remove(usersLiked)
            }
        } else if([like] == 0) { //checks if the arrays usersLiked and usersDisliked include the user
            if(usersDisliked.includes(userId)) {
                remove(usersDisliked) 
            } 
            if (usersLiked.includes(userId)){
                remove(usersLiked)
            }
        } else { //prevent user from adding a dislike and a like at the same time
            if(usersDisliked.includes(userId)){
                remove(usersDisliked)
            }
            if (!usersLiked.includes(userId)){
                add(usersLiked)
            }
        }
        product.save()
        .then(() => res.status(200).json({message: 'avis ajouté'}))
        .catch(error => res.status(400).json({ error }))
    })
}
