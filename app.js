const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
require('dotenv/config');
const cors = require("cors");

//USE CORS ONCE HOSTED

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// app.use(cors);

//Middlewares
app.use(bodyParser.json());

//import routes
const productsRoute = require('./routes/products');
app.use('/products', productsRoute);

const usersRoute = require('./routes/users');
app.use('/users', usersRoute);

const ordersRoute = require('./routes/orders')
app.use('/orders', ordersRoute)


mongoose.connect('mongodb+srv://frontend:frontend@robertsfreecluster.kkllv.mongodb.net/swimmingshopdb?ssl=true&sslverifycertificate=false&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response => {
        console.log("connected to db")
    })


//Listen to server
app.listen(process.env.PORT || 3000);
