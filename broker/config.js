// broker/config.js

// It is common to use environment variables so you can override the defaults
module.exports = {
    services: {
      auth: process.env.AUTH_SERVICE_URL || 'http://localhost:4000',
      course: process.env.COURSE_SERVICE_URL || 'http://localhost:5000'
    }
  };
  