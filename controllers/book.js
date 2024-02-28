const Books = require('../models/Books')


exports.putModifiedOneBook = (req, res, next) => {
  console.log('getOneBook done' + req.body + req.params.id)
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/resizedimages/${req.file.originalname}`
} : { ...req.body };

  delete bookObject._userId;
    Books.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Books.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Livre modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  console.log('getOneBook done' + req.body + req.params.id)
    Books.findOne({_id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({error}));
};

exports.postcreateBook = (req, res, next) =>{
  console.log("post bonjour")
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Books({
    ...bookObject,
    userId:req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/resizedimages/${req.file.originalname}`
  });
  book.save()
  .then(() => res.status(201).json({message:'livre ajouté'}))
  .catch((error) => {res.status(400).json( { error } )});
  console.log("post aurevoir")
};

exports.deleteBook = (req, res) => {
    Books.delete({_id: req.params.id})
    .then(() => res.status(200).json({message:'livre supprimé'}))
    .catch(error => res.status(400).json({error}));
}

exports.getBestRatingBooks = (req, res, next) => {
  Books.find()
      .sort({averageRating:"desc"}).limit(3)
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({error}))
};

exports.getAllBooks = (req, res, next) => {
    console.log('getAllBooks done')
    Books.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({error}))
    
  };
