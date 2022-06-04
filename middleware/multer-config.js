const multer = require('multer')

const MIME_TYPES = {
    '.image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, files, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_')
        const ext = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + ext)
    }
})

module.exports = multer({ storage }).single('image')