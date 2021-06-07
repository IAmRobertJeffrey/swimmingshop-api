const mongoose = require('mongoose');
// const User = require('user')
// const Product = require('product')

const OrderSchema = mongoose.Schema({
    productIds:
        [
            {
                type: String,
                ref: 'Product',
                required: true
            }
        ],
    userId:
        {
            type: String,
            ref:'User',
            required: true
        }

}, {timestamps:true})

module.exports = mongoose.model('Orders', OrderSchema)