// auth-service/app.js
const express = require('express');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
require('./config/db'); // Connects to MongoDB

const app = express();
app.use(bodyParser.json());

// Import User model to seed dummy users
const User = require('./models/User');

// Seed dummy users if they don't already exist
(async () => {
    try {
        // Check and create a dummy student account
        const studentUser = await User.findOne({ username: 'student1' });
        if (!studentUser) {
            await User.create({ username: 'student1', password: 'password', role: 'student' });
            console.log("Created dummy user: student1 (student)");
        } else {
            console.log("Dummy user student1 already exists.");
        }

        // Check and create a dummy faculty account
        const facultyUser = await User.findOne({ username: 'faculty1' });
        if (!facultyUser) {
            await User.create({ username: 'faculty1', password: 'password', role: 'faculty' });
            console.log("Created dummy user: faculty1 (faculty)");
        } else {
            console.log("Dummy user faculty1 already exists.");
        }
    } catch (err) {
        console.error("Error seeding dummy users:", err);
    }
})();

// Use the routes defined in routes/index.js
app.use('/', indexRouter);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});
