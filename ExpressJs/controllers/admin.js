const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: "Add Products",
    path: "/admin/add-product",
    editing: false
  });

};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;

  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  }).then(result => {
    console.log('Product Created');
    res.redirect('/admin/products');
  })
    .catch(err => console.log(err))
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      if (!product) {
        res.redirect('/')
      };
      res.render('admin/edit-product', {
        pageTitle: "Add Products",
        path: "/admin/edit-product",
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  Product.findByPk(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDescription;
      return product.save();
    })
    .then(result => {
      console.log('Updated Product');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findByPk(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log('Product destroyed');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));

};

exports.getAdminProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => console.log(err));
};