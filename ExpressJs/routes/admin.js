const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product',
  [
    body('title')
      .trim()
      .isString()
      .isLength({ min: 5 }),
    body('price')
      .isFloat(),
    body('description')
      .isLength({ min: 5, max: 200 })
      .trim()
  ],
  isAuth, adminController.postAddProduct);

router.get('/products', isAuth, adminController.getAdminProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product',
  [
    body('title')
      .isString()
      .isLength({ min: 5 })
      .trim()
      .withMessage('invalid Title'),
    body('price')
      .isFloat()
      .withMessage('invalid Price'),
    body('description')
      .isLength({ min: 5, max: 200 })
      .trim()
      .withMessage('invalid Description'),
  ], isAuth, adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;