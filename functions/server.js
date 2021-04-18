const express = require('express');
const serverless = require('serverless-http');
const app = express();
const path = require('path')

// set the view engine to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', require('./routes/user'))

module.exports.handler = serverless(app)