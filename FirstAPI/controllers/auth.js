const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed!');
    error.statusCode = 422;
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  try {
    const hashedPass = await bcrypt.hash(password, 12)

    const user = new User({
      email: email,
      password: hashedPass,
      name: name
    })
    await user.save();
    res.status(201).json({ message: 'User created successfully!', userId: user._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      const error = new Error('A user with this email can not be found!');
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({
      email: user.email,
      userId: user._id.toString()
    }, 'superdupersecret', { expiresIn: '1h' });

    res.status(200).json({ token: token, userId: user._id.toString() })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      const error = new Error('Could not find user!');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Status found!', status: user.status })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed!');
    error.statusCode = 422;
    error.data = error.array();
    throw error;
  }
  const newStatus = req.body.status;
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      const error = new Error('Could not find user!');
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    await user.save();
    res.status(200).json({ message: 'Update status successfully!' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}