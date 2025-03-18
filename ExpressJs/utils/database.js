const mysqul = require('mysql2');

const pool = mysqul.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete',
  password: 'Wrn9006216400'
});

module.exports = pool.promise();