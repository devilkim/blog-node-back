'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const blog = require('./routes/blog');
const {res, notFound} = require('./_core/middleware');
const mysql = require('./_core/mysql');

app.use(cors({
	origin: 'http://localhost:8030'
}));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(morgan(':date[iso] :status :method :url :response-time ms :res[content-length] bytes'));

app.use('/v1', blog);
app.use(notFound);
app.use(mysql.release);
app.use(res('json'));

mysql.config(mysql.extractConifg(process.env));

app.listen(process.env.PORT, () => {
    console.info(`Server has started(${process.env.PORT}).`);
});