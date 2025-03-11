const express = require('express');
const path = require('path');

const router = express.Router();

const users = [];

router.get('/form', (req, res, next) => {
  res.render('form', { pageTitle: 'User form' });
});

router.post('/form', (req, res, next) => {
  users.push({ username: req.body.name })
  res.redirect('/');
});

exports.users = users;
exports.routes = router;