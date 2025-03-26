const { ObjectId } = require('mongodb');
const getDb = require('../utils/database').getDb;

class User {
  constructor(username, email, _id) {
    this.username = username;
    this.email = email;
    this._id = _id ? new ObjectId(_id) : null;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db.collection('users').updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('users').insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log('new user', result);
      })
      .catch(err => console.log(err))
  }

  static findById(prodId) {
    const db = getDb();
    return db.collection('users').find({ _id: ObjectId.createFromHexString(prodId) }).next()
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => console.log(err))
  }
}

module.exports = User;