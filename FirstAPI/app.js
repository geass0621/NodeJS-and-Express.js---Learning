const express = require('express');
const feedRoutes = require('./routes/feed');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json()); //application/json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

app.use('/feed', feedRoutes);

mongoose
  .connect('mongodb+srv://dongcuong0621:NdLTGXBI5TpinOVK@cluster0.qhvix.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0')
  .then(result => {
    app.listen(8080);
    console.log('Connected');
  })
  .catch(err => {
    console.log(err);
  })