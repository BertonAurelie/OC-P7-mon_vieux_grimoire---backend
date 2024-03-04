const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    console.log("multer" + JSON.stringify(file))
    const name = file.originalname.split(' ').join('_').split('.')[0];
    callback(null, name );
    console.log("multer" + JSON.stringify(file))
  }
});

module.exports = multer({storage: storage}).single('image');