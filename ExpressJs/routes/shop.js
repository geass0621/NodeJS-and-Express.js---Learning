const express = require('express');
const path = require('path');

const adminData = require('./admin')

const rootDir = require('../utils/path')

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log(adminData.products)
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;