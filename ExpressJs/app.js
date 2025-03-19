const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop')
const errorController = require('./controllers/error');
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);

app.use(userRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE'
})
User.hasMany(Product)

sequelize.sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({
        name: 'Mike',
        email: 'mike@abv.com'
      });
    }
    return Promise.resolve(user);
  })
  .then(user => {
    //console.log(user);
    app.listen(3000);
  })
  .catch(err => console.log(err));

