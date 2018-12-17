console.log('Start of app.js...');

// Express is required
const express = require('express');
// Here we initiate Express
const app = express();
// Here we initiate morgan
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb://localhost:27017/webservice', {
    useNewUrlParser: true
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Handling CORS Errors.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allows everyone access to the API, this is RESTful.
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        res.header('Allow', 'POST, GET, OPTIONS');
        return res.status(200).json({});
    };
    if (req.header('Accept') == 'application/json'){
        return res.status(415).json({
            message: 'Unsupported header.'
        });
    };
    next();
});

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Error handling is programmed below
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
console.log('End of app.js...');