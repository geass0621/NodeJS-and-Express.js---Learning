const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'geas0621@gmail.com',
    pass: ''
  }
})

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        res.redirect('/login');
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            })
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login')
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  })
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: { email: email, password: password, confirmPassword: req.body.confirmPassword }
    });
  }

  bcrypt.hash(password, 12)
    .then(hashPass => {
      const user = new User({
        email: email,
        password: hashPass,
        cart: { items: [] }
      });
      user.save();
    })
    .then(result => {
      res.redirect('/login');
      // return transporter.sendMail({
      //   to: email,
      //   from: '',
      //   subject: 'Signup succeeded!',
      //   html: '<h1>You successfully signup!</h1>'
      // }
      // );
    })
    .catch(err => console.log(err));
}

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        return transporter.sendMail({
          to: req.body.email,
          from: 'geas0621@gmail.com',
          subject: 'Password reset',
          html: `
          <p>You requested password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> link to set a new password</p>
          `
        }
        );
      })
      .catch(err => console.log(err));

  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  console.log(token);
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      console.log(user);
      if (user) {
        let message = req.flash('error');
        if (message.length > 0) {
          message = message[0];
        } else {
          message = null;
        }
        res.render('auth/new-password', {
          path: '/new-password',
          pageTitle: 'New Password',
          errorMessage: message,
          userId: user._id.toString(),
          passwordToken: token
        })
      } else {
        res.redirect('/');

      }
    })
    .catch(err => {
      console.log(err);
    })
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      if (user) {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
      } else {
        res.redirect('/');
      }
    })
    .then(hashedPass => {
      resetUser.password = hashedPass;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => console.log(err))
}

