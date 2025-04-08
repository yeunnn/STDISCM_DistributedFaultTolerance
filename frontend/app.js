// frontend/app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const indexRouter = require('./routes/index');

const app = express();

// Set EJS as the templating engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Parse URL-encoded bodies and JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// Set up session middleware
app.use(session({
    secret: 'frontendsecret',
    resave: false,
    saveUninitialized: true
}));

// Mount routes
app.use('/', indexRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Frontend running on port ${PORT}`);
});
