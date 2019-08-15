'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const blog = require('./routes/blog');
const {res, notFound} = require('./_core/http');
const mysql = require('./_core/mysql');
const pages = ['/', '/view', '/add', '/blogs', '/blogs/tag'];

if (process.env.ENVIRONMENT === 'development') {
	app.use(cors({
		origin: 'http://localhost:8030'
	}));
}
if (process.env.ENVIRONMENT !== 'development') {
	pages.map(page => app.use(page, express.static('app')));
}
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(morgan(':date[iso] :status :method :url :response-time ms :res[content-length] bytes'));

app.use('/v1', blog);
app.use(notFound);
app.use(res('json'));

mysql.config(mysql.extractConifg(process.env));

app.listen(process.env.PORT, () => {
    console.info(`Server has started(${process.env.PORT}).`);
});