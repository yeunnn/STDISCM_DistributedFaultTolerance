// course-service/app.js
const express = require('express');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
require('./config/db'); // Connects to MongoDB

const app = express();
app.use(bodyParser.json());

// Import Course model for seeding dummy courses
const Course = require('./models/Course');

// Seed dummy courses if they don't already exist
(async () => {
    try {
        // Dummy courses data
        const dummyCourses = [
            { courseId: 'CSE101', name: 'Introduction to Computer Science' },
            { courseId: 'CSE102', name: 'Data Structures' },
            { courseId: 'CSE103', name: 'Distributed Systems' }
        ];

        for (const courseData of dummyCourses) {
            const existingCourse = await Course.findOne({ courseId: courseData.courseId });
            if (!existingCourse) {
                await Course.create(courseData);
                console.log(`Created dummy course: ${courseData.courseId} - ${courseData.name}`);
            } else {
                console.log(`Dummy course ${courseData.courseId} already exists.`);
            }
        }
    } catch (err) {
        console.error("Error seeding dummy courses:", err);
    }
})();

// Mount routes
app.use('/', indexRouter);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Course Service running on port ${PORT}`);
});
