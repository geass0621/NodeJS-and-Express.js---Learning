const expect = require('chai').expect;
const sinon = require('sinon');
const User = require('../models/user');
const AuthController = require('../controllers/auth');
const mongoose = require('mongoose');

describe('Auth Controller', function () {
  before(function (done) {
    mongoose
      .connect('mongodb+srv://dongcuong0621:NdLTGXBI5TpinOVK@cluster0.qhvix.mongodb.net/test-messages?retryWrites=true&w=majority&appName=Cluster0')
      .then(result => {
        const user = new User({
          email: 'test@test.com',
          password: 'tester',
          name: 'test',
          post: [],
          _id: '5c0f66b979af55031b34728a'
        })
        return user.save();
      })
      .then(() => {
        done();
      })
  })
  it('Should throw an error with code 500 if accessing the database fails', function (done) {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: 'test@test.com',
        password: 'testtesttest'
      }
    };

    AuthController.login(req, {}, () => { }).then(result => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 500);
      done();
    });
    User.findOne.restore();
  });

  it('Should send a response with a valid user status for existing user', function (done) {
    const req = {
      params: {
        userId: '5c0f66b979af55031b34728a'
      }
    };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      }
    };
    AuthController.getStatus(req, res, () => { }).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal('I am new!');
      done()
    });
  });
  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      })
      .catch(err => {
        console.log(err)
      })
  })
});