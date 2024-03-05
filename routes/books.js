const express = require('express')
const auth = require('../middleware/auth')
const bookCtrl = require('../controllers/book')
const multer = require('../middleware/multer-config')
const sharp = require('../middleware/sharp')

const router = express.Router();

router.put('/:id', auth, multer,sharp, bookCtrl.putModifiedOneBook);
router.delete('/:id',auth, bookCtrl.deleteBook);
router.get('/', bookCtrl.getAllBooks);
router.post('/',auth, multer,sharp, bookCtrl.postcreateBook);
router.get('/bestrating', bookCtrl.getBestRatingBooks);
router.post('/:id/rating',auth, bookCtrl.postAuthRatingBook);
router.get('/:id', bookCtrl.getOneBook);

module.exports = router;

