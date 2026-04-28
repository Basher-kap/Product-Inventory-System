require('dotenv').config(); //import dotenv package to load env var from .env file into your Node.js app
const mongoose = require('mongoose'); //mongoose is the library that helps you define schemas, create models, and interact with db CRUD
const User = require('./app/models/User'); //import the User model to create user documents in the database

const users = [
    { username: 'Basher', password: 'Bash_123' },
    { username: 'Nagi', password: '02172005' }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {

    for (const userData of users) {
        const existing = await User.findOne({ username: userData.username });

        if (!existing) {
            await User.create(userData); // only runs if user doesn't exist yet
            console.log(`Created user: ${userData.username}`);
        } else {
            console.log(`⏭️ Skipped: ${userData.username} already exists`);
        }
        
    }
    mongoose.disconnect(); //just disconnect after seeding
}).catch(err => console.error('Seed error:', err));