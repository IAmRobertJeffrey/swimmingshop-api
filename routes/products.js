const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const router = express.Router();
const Product = require('../models/product')

router.get('/', async (request, result) =>
{
   try{

        const products = await Product.find();
        result.json(products);
   }
   catch(err)
   {
       result.json({message:err});
   }
})

router.get('/:productId', async (request, result) =>
{
    try{
        const product = await Product.findById(request.params.productId);
        if(product)
        {
            result.json(product);
        }
        else
        {
            const errorObject = {
                response: "The provided (productId) from the request parameter does not exist."
            }
            result.json(errorObject)
        }
    }
    catch(err)
    {
        result.json({message:err});
    }
})

router.post('/',async (request, result) =>
{
    const product = new Product({
        productName: request.body.productName,
        productPrice: request.body.productPrice,
        productStock: request.body.productStock,
        productImage: request.body.productImage
    })
    try {
        const savedProduct = await product.save();
        result.json(savedProduct)
    }
    catch (err)
    {
        result.json(err)
    }
})

router.delete('/:productId', async (request, result) => {

    try
    {
        const removedPost = await Product.deleteMany({_id: request.params.productId})
        result.send(removedPost)
    }
    catch(err)
    {
        result.json(err)
    }
})

router.patch('/:productId', async (request, result) =>
{
    try
    {
        let updatedProduct = {}

        if(request.body.productName)
        {
            updatedProduct = await Product.findByIdAndUpdate(request.params.productId, {
                productName: request.body.productName,
            }, {new: true, useFindAndModify: false});
        }
        if(request.body.productPrice)
        {
            updatedProduct = await Product.findByIdAndUpdate(request.params.productId, {
                productPrice: request.body.productPrice,
            }, {new: true, useFindAndModify: false});
        }
        if(request.body.productStock)
        {
            updatedProduct = await Product.findByIdAndUpdate(request.params.productId, {
                productStock: request.body.productStock,
            }, {new: true, useFindAndModify: false});
        }
        if(request.body.productImage)
        {
            updatedProduct = await Product.findByIdAndUpdate(request.params.productId, {
                productImage: request.body.productImage,
            }, {new: true, useFindAndModify: false});
        }

        result.json(updatedProduct);
    }
    catch (err)
    {
        result.json(err)
    }
})

router.patch('/addStock/:productId', checkAuth, async (request, result) =>
{
    try
    {
        let productToUpdate = await Product.findById(request.params.productId)
        if(productToUpdate)
        {
            if (request.body.productQuantity)
            {

                let amountOfStock = productToUpdate.productStock


                let reStockedProduct = await Product.findByIdAndUpdate(request.params.productId, {
                    productStock: amountOfStock + request.body.productQuantity
                }, {new: true, useFindAndModify: false})

                result.json(reStockedProduct)

            } else {
                let errorObject =
                    {
                        response: "(productQuantity) in request body not provided"
                    }
                result.json(errorObject)
            }
        }
        else
        {
            const errorObject = {
                response: "(productId) provided in the request parameter does not exist."
            }
            result.json(errorObject)
        }
    }
    catch (err)
    {
        result.json(err)
    }
})


module.exports = router;