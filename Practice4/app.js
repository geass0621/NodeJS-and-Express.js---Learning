const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');

const usersData = require('./routes/users');
const form = require('./routes/form');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(usersData.routes);
app.use(form.routes)

app.listen(3000);
