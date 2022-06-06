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
router.post('/', auth, multer, addSauce)
router.put('/:id', auth, multer, updateSauce)
router.delete('/:id', auth, deleteSauce)
router.get('/:id', auth, getOneSauce)
router.get('/', auth, getAllSauces)
router.post('/:id/like', auth, likeOneSauce)

module.exports = router
