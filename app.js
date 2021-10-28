const express = require('express');
const bodyParser = require('body-parser');
const hpp = require('hpp');

const app = express();
app.use(hpp());
module.exports = app;
