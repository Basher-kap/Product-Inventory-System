// app/models/Cart.js

const mongoose = require('mongoose');

// detailed item of a cart, qty is stored here
const cartItemSchema = new mongoose.Schema({
    productCode: { type: String, required: true },
    productName: { type: String, required: true },
    unitPrice:   { type: Number, required: true },
    productImage:{ type: String, default: '' },
    quantity:    { type: Number, required: true, min: 1, default: 1 }
});

// one cart document per user, identified by username
const cartSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // one cart doc per user
    items:    [cartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);