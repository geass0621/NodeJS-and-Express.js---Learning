const express = require('express');
const feedRoutes = require('./routes/feed');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'images');
  },
  filename: (req, res, cb) => {
    cb(null, uuidv4());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

app.use(bodyParser.json()); //application/json
app.use(multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;

  res.status(status)
    .json({
      message: message
    });
})

mongoose
  .connect('mongodb+srv://dongcuong0621:NdLTGXBI5TpinOVK@cluster0.qhvix.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0')
  .then(result => {
    app.listen(8080);
    console.log('Connected');
  })
  .catch(err => {
    console.log(err);
  })