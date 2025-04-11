const express = require('express');
const feedRoutes = require('./routes/feed');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(bodyParser.json()); //application/json
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