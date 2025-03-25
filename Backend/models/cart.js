const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Product',
     required: true },
   name : String,
   image: String,
   price : String,
   size: String,
   color: String,
   quantity : {
    type:Number,
    default:1
   }
} ,{_id:false});

const CartSchema = new mongoose.Schema({
    user: {
         type: mongoose.Schema.Types.ObjectId, ref: 'User', 
         required: false
         }, 
    guestId: { 
        type: String,
         required: false 

    }, 
    products: {
         type: [CartItemSchema],
        }, 
    totalPrice: { 
        type: Number,
         required: true, 
         default: 0 
        },
}, { timestamps: true }); 

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
