const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    productName:
        {
            type: String,
            required: true,
        },
    productPrice:
        {
            type: Number,
            required: true,
        },
    productStock:
        {
            type: Number,
            required: true
        }

},{timestamps:true})

module.exports = mongoose.model('Products', ProductSchema)