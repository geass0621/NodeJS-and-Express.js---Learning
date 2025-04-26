const expect = require('chai').expect;
const sinon = require('sinon');
const User = require('../models/user');
const Post = require('../models/post');
const FeedController = require('../controllers/feed');
const mongoose = require('mongoose');
const io = require('../socket');

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
  it('Should add a created post to the posts of the creator', function (done) {

    const req = {
      body: {
        title: 'Test Post',
        content: 'A test post'
      },
      file: {
        path: 'abc'
      },
      creator: '5c0f66b979af55031b34728a',
      userId: '5c0f66b979af55031b34728a'
    };

    const res = { status: function () { return this }, json: function () { } };

    sinon.stub(io, 'getIO');
    io.getIO.returns({ emit: () => { } });
    FeedController.createPost(req, res, () => { })
      .then(savedUser => {
        expect(savedUser).to.have.property('posts');
        expect(savedUser.posts).to.have.length.greaterThan(0);
        io.getIO.restore();
        done();
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