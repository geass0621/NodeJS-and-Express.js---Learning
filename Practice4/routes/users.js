const express = require('express');
const path = require('path');

const router = express.Router();

const usersData = require('./form');

router.get('/', (req, res, next) => {
  const users = usersData.users
  res.render('users', { users: users, pageTitle: 'Users' });
});

exports.routes = router;