const express = require('express');
const path = require('path')

const rootDir = require('../utils/path');
const { title } = require('process');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
  res.render('add-product', { pageTitle: "Add Products", path: "/admin/add-product", activeAddProduct: true, formsCSS: true, productCSS: true })
});

router.post('/add-product', (req, res, next) => {
  products.push({ title: req.body.title })
  res.redirect('/');
});

exports.routes = router;
exports.products = products;