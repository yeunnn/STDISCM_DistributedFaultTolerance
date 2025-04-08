// course-service/config/db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/course_service', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Course Service: MongoDB connected.');
}).catch(err => {
    console.error('Course Service MongoDB connection error:', err);
});
