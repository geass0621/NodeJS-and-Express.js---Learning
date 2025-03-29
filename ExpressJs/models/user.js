const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }]
  }
})

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
  let newQty = 1;
  const cartUpdatedItems = [...this.cart.items]

  if (cartProductIndex >= 0) {
    newQty = this.cart.items[cartProductIndex].quantity + 1;
    cartUpdatedItems[cartProductIndex].quantity = newQty;
  } else {
    cartUpdatedItems.push({ productId: product._id, quantity: newQty })
  }

  const updatedCart = {
    items: cartUpdatedItems
  };

  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.removeFromCart = function (prodId) {
  const updatedCartItems = this.cart.items.filter(i => {
    return i.productId.toString() !== prodId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
}

userSchema.methods.clearCart = function () {
  this.cart = { items: [] }
  return this.save();
}

module.exports = mongoose.model('User', userSchema);

// const { ObjectId } = require('mongodb');
// const getDb = require('../utils/database').getDb;

// class User {
//   constructor(username, email, _id, cart) {
//     this.username = username;
//     this.email = email;
//     this._id = _id ? new ObjectId(_id) : null;
//     this.cart = cart;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db.collection('users').updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection('users').insertOne(this);
//     }
//     return dbOp
//       .then(result => {
//         console.log('new user', result);
//       })
//       .catch(err => console.log(err))
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
//     let newQty = 1;
//     const cartUpdatedItems = [...this.cart.items]

//     if (cartProductIndex >= 0) {
//       newQty = this.cart.items[cartProductIndex].quantity + 1;
//       cartUpdatedItems[cartProductIndex].quantity = newQty;
//     } else {
//       cartUpdatedItems.push({ productId: new ObjectId(product._id), quantity: newQty })
//     }

//     const updatedCart = {
//       items: cartUpdatedItems
//     };


//     const db = getDb();
//     return db.collection('users').updateOne(
//       {
//         _id: new ObjectId(this._id)
//       },
//       {
//         $set: { cart: updatedCart }
//       });
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     })
//     return db.collection('products').find({ _id: { $in: productIds } }).toArray()
//       .then(products => {
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(i => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity
//           }
//         })
//       })

//   }

//   deleteItemFromCart(prodId) {
//     const updatedCartItems = this.cart.items.filter(i => {
//       return i.productId.toString() !== prodId.toString();
//     })

//     const db = getDb();
//     return db.collection('users').updateOne(
//       {
//         _id: new ObjectId(this._id)
//       },
//       {
//         $set: { cart: { items: updatedCartItems } }
//       });

//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             username: this.username,
//             email: this.email
//           }
//         }
//         return db.collection('orders').insertOne(order)
//       })
//       .then(result => {
//         this.cart = { items: [] };
//         return db.collection('users').updateOne(
//           {
//             _id: new ObjectId(this._id)
//           },
//           {
//             $set: { cart: { items: [] } }
//           });
//       })
//       .catch(err => console.log(err))
//   }

//   getOrders() {
//     const db = getDb();
//     return db.collection('orders').find({ 'user._id': new ObjectId(this._id) }).toArray();
//   }

//   static findById(prodId) {
//     const db = getDb();
//     return db.collection('users').find({ _id: ObjectId.createFromHexString(prodId) }).next()
//       .then(user => {
//         console.log(user);
//         return user;
//       })
//       .catch(err => console.log(err))
//   }
// }

// module.exports = User;