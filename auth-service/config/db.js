// auth-service/config/db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/auth_service', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Auth Service: MongoDB connected.');
}).catch(err => {
    console.error('Auth Service MongoDB connection error:', err);
});
