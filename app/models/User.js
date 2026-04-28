//app/models/User.js

//defines the shape/structure of your data 
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    //-2.0 User Authentication fields, username and password required
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    //-1.0 User Profile Management fields, first it was defaulted to empty string to avoid undefined values, then we will update it when user saves their profile
    firstName:  { type: String, default: '' },
    middleName: { type: String, default: '' },
    lastName:   { type: String, default: '' },
    address:    { type: String, default: '' },
    email:      { type: String, default: '' }
});

module.exports = mongoose.model('User', userSchema);