const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: "Add Products",
    path: "/admin/add-product",
    activeAddProduct: true,
    formsCSS: true,
    productCSS: true
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect('/');
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
      formsCSS: true,
    });
  });
};