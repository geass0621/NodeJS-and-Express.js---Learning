const authMiddleware = require('../middleware/isAuth');
const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

describe('Auth middleware', function () {
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

  it('Should yield a userId after decoding the token', function () {
    const req = {
      get: function () {
        return 'Bearer asdasdasdasdsadasdsad';
      }
    };
    sinon.stub(jwt, 'verify')
    jwt.verify.returns(
      { userId: 'abc' }
    );
    authMiddleware(req, {}, () => { })
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });

  it('Should throw an error if the token can not be verified', function () {
    const req = {
      get: function () {
        return 'Bearer xyz';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => { })).to.throw();
  });


})

