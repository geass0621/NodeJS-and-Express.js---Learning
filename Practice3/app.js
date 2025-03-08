const express = require('express');
const path = require('path');

const homeRoute = require('./routes/home');
const userRoute = require('./routes/users');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(homeRoute);
app.use(userRoute);


app.listen(3000);