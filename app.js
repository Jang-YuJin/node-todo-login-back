const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', indexRouter);
const mongoURI = process.env.MONGODB_URI_PROD;

mongoose.connect(mongoURI).then(() => {
    console.log('connect');
}).catch((err) => {
    console.log('connect faile: ', err);
});

app.listen(5000, () => {
    console.log('server on 5000');
});

