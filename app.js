const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
require('dotenv/config');
const cors = require("cors");

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


mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response => {
        console.log("connected to db")
    })


//Listen to server
app.set('port', process.env.PORT || 3000);
app.get('/', (request, response) =>
{
    const rootObject = {
        routes: ["/users", "/products", "/orders"]
    }
    response.json(rootObject)
})

app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

