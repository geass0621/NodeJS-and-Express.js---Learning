const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');

const errorController = require('./controllers/error');
const mongoConnect = require('./utils/database').mongoConnect;
const User = require('./models/user');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById("67e40a82f6d5551e3bf66083")
    .then(user => {
      req.user = new User(user.username, user.email, user._id, user.cart);
      next();
    })
    .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);

app.use(userRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000)
})

