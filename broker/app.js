// broker/app.js
const express = require('express');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');

const app = express();
app.use(bodyParser.json());

app.use('/api', indexRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Broker running on port ${PORT}`);
});
