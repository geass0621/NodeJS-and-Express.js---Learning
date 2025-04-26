const authMiddleware = require('../middleware/isAuth');
const expect = require('chai').expect;

it('Should throw an error if no authorization header is present', function () {
  const req = {
    get: function () {
      return null;
    }
  }
  expect(authMiddleware.bind(this, req, {}, () => { })).to.throw('Not authenticated');
});

it('Should throw an error if the authorization header is one string', function () {
  const req = {
    get: function () {
      return 'xyz';
    }
  };
  expect(authMiddleware.bind(this, req, {}, () => { })).to.throw();
});