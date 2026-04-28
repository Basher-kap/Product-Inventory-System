//app/models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productCode:  { type: String, required: true, unique: true, trim: true },
    productName:  { type: String, required: true, trim: true },
    quantity:     { type: Number, required: true, min: 0, default: 0 },
    unitPrice:    { type: Number, required: true, min: 0, default: 0 },
    productImage: { type: String, default: '' } // base64 data URI or URL
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);