const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');


const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://dongcuong0621:NdLTGXBI5TpinOVK@cluster0.qhvix.mongodb.net/Shop?retryWrites=true&w=majority&appName=Cluster0';


const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'session'
})

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use((req, res, next) => {
  User.findById('67e56bdc22db2a938a01c491')
    .then(user => {
      req.user = user
      next();
    })
    .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);

app.use(userRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://dongcuong0621:NdLTGXBI5TpinOVK@cluster0.qhvix.mongodb.net/Shop?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    User.findOne()
      .then(user => {
        if (!user) {
          const user = new User({
            name: 'Mike',
            email: 'mike@abv.com',
            cart: {
              items: []
            }
          })
          user.save()
        }
      })

    app.listen(3000);
    console.log('Connected');
  })
  .catch(err => console.log(err))

