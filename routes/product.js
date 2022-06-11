const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const { addSauce,
        updateSauce,
        deleteSauce,
        getOneSauce,
        getAllSauces,
        likeOneSauce} = require('../controllers/product')

// sauce management
router.route('/').get(auth, getAllSauces)
                 .post(auth, multer, addSauce)
router.route('/:id').put(auth, multer, updateSauce)
                    .get(auth, getOneSauce)
                    .delete(auth, multer, deleteSauce)
router.route('/:id/like').post(auth, likeOneSauce)

module.exports = router
