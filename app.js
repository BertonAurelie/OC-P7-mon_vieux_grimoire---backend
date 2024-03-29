const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const booksRoutes = require('./routes/books')

const userRoutes = require('./routes/user')

const Auth = require('./models/User');

const app = express();

app.use(express.json());

mongoose.connect('mongodb+srv://user1:WFCjLhssNv0TpKlu@cluster0.oqow0zb.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('/api/auth', userRoutes);
app.use('/api/books', booksRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
module.exports = app;