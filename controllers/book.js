const Books = require('../models/Books');
const fs = require('fs');


exports.putModifiedOneBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/resizedimages/${req.file.filename}.webp`
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
    Books.findOne({_id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({error}));
};

exports.postcreateBook = (req, res, next) =>{
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Books({
    ...bookObject,
    userId:req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/resizedimages/${req.file.filename}.webp`
  });
  book.save()
  .then(() => res.status(201).json({message:'livre ajouté'}))
  .catch((error) => {res.status(400).json( { error } )});
};

exports.deleteBook = (req, res) => {
  Books.findOne({ _id: req.params.id})
    .then(book => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = book.imageUrl.split('/images/resizedimages')[1];
            fs.unlink(`images/resizedimages/${filename}`, () => {
              Books.deleteOne({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                  .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
    res.status(500).json({ error });
  });
}

exports.getBestRatingBooks = (req, res, next) => {
  Books.find()
      .sort({averageRating:"desc"}).limit(3)
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({error}))
};

exports.postAuthRatingBook = (req, res, next) => {
  console.log("postAuthRatingBook" + JSON.stringify(req.body))
  console.log("AUTHPOST " + JSON.stringify(req.auth.userId))
  console.log("AUTHPOST " + req.params.id)
  Books.findOneAndUpdate({ _id: req.params.id, 'ratings.userId' : {$nin : [req.auth.userId]}}
      , {
      $push: {
        ratings : {
        userId: req.body.userId,
        grade: req.body.rating}
      }
      },
      {upsert : true}
    ).then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({error}))
}

exports.getAllBooks = (req, res, next) => {
    Books.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({error}))
};

