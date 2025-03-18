const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Wrn9006216400', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;