const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const router = express.Router();
const Order = require("../models/order")
const Product = require("../models/product")
const User = require("../models/user")


router.get('/', checkAuth,  async (request, response) =>
{
    try
    {
        const orders = await Order.find();
        response.json(orders);
    }
    catch(err)
    {
        response.json(err);
    }
})

router.get('/:orderId', checkAuth, async (request, response) =>
{
    try
    {
        const searchedOrder = await Order.findById(request.params.orderId)

        if(searchedOrder)
        {
            response.json(searchedOrder);
        }
        else
        {
            const errorObject = {
                response: "the provided orderId does not exist"
            }
            response.json(errorObject)
        }
    }
    catch (err)
    {
        response.json(err)
    }
})

router.post('/', checkAuth, async (request, response) =>
{
    try {
        const searchedProducts = request.body.productIds
        const searchedUser = request.body.userId
        let productsInStockAfterOrder = new Map();
        let productsOutOfStockAfterOrder = new Map();
        let uniqueProductsAfterOrder = new Map();
        let uniqueProductsBeforeOrder = new Map();
        let outOfStockItemList = [];
        let inStockItemList = [];
        let searchedProductsArray = [];
        let idArray = []

        if (searchedProducts && searchedUser)
        {

            const user = await User.findById(request.body.userId);

            if(user === null)
            {
                const errorObject = {response: "failed: the userId provided does not exist"}
                response.json(errorObject)
                return;
            }


            for (let i = 0; i < searchedProducts.length; i++)
            {
                const currentProduct = await Product.findById(searchedProducts[i]);

                searchedProductsArray.push(currentProduct);

                if (currentProduct)
                {
                    if (currentProduct.productStock > 0)
                    {
                        inStockItemList.push(currentProduct)
                    }
                    else
                    {
                        outOfStockItemList.push(currentProduct)
                    }
                }
            }
            for (let searchedProduct of searchedProductsArray)
            {
                idArray.push(searchedProduct)
            }



            if (idArray.includes(null))
            {

                const errorObject = {response: "failed: a productId provided does not exist"}
                response.json(errorObject)
                return;
            }
            if (outOfStockItemList.length > 0)
            {
                for (const stockProduct of outOfStockItemList)
                {
                    let stockToRemove = 0;
                    for (let currentProductForCount of outOfStockItemList)
                    {
                        if (stockProduct.equals(currentProductForCount))
                        {
                            stockToRemove++;
                        }
                    }
                    if(uniqueProductsBeforeOrder.has(JSON.stringify(stockProduct)))
                    {
                    }
                    else
                    {
                        uniqueProductsBeforeOrder.set(JSON.stringify(stockProduct), stockToRemove)
                    }
                }
            }
                for (const currentProduct of inStockItemList)
                {
                    let stockToRemove = 0;
                    for (let currentProductForCount of inStockItemList)
                    {
                        if (currentProduct.equals(currentProductForCount))
                        {
                            stockToRemove++;
                        }
                    }
                    if (currentProduct.productStock >= stockToRemove)
                    {
                        productsInStockAfterOrder.set(currentProduct, stockToRemove)
                    }
                    else
                    {
                        productsOutOfStockAfterOrder.set(currentProduct, stockToRemove)
                        if(uniqueProductsAfterOrder.has(JSON.stringify(currentProduct)))
                        {
                        }
                        else
                        {
                            uniqueProductsAfterOrder.set(JSON.stringify(currentProduct), stockToRemove)
                        }
                    }
                }
                if (uniqueProductsAfterOrder.size > 0 || uniqueProductsBeforeOrder.size > 0)
                {
                    let productsOOS = []

                    for (const product of uniqueProductsAfterOrder)
                    {
                        const newProduct = {}

                        newProduct.product = JSON.parse(product[0])
                        newProduct.orderQuantity = product[1]

                        productsOOS.push(newProduct)
                    }

                    for(const currentProduct of uniqueProductsBeforeOrder)
                    {
                        const newProduct = {}

                        newProduct.product = JSON.parse(currentProduct[0])
                        newProduct.orderQuantity = currentProduct[1]

                        productsOOS.push(newProduct)
                    }
                    const errorObject =
                        {
                            outOfStock:
                                [
                                    ...productsOOS
                                ]
                        }

                    return response.send(errorObject);
                }
                if (productsInStockAfterOrder.size === searchedProducts.length)
                {
                    for (const currentProductForUpdate of inStockItemList)
                    {
                        const updatedProduct = await Product.findByIdAndUpdate(currentProductForUpdate._id, {
                            productStock: currentProductForUpdate.productStock - productsInStockAfterOrder.get(currentProductForUpdate),
                        }, {new: true, useFindAndModify: false})
                    }
                }

                const newOrder = new Order({
                    productIds: request.body.productIds,
                    userId: request.body.userId
                })

                const savedOrder = await newOrder.save();
                response.json(savedOrder)

        }
        else
        {
            const errorObject = JSON.parse('{"response": "failed: lack of either a (productIds) array, or (userId) provided."}')
            response.send(errorObject)
        }
    }
    catch (err)
    {
        response.json(err)
    }
})

router.delete('/:orderId', checkAuth, async (request, response) => {
    try
    {
        const orderToCheck = await Order.findById(request.params.orderId)
        if(orderToCheck)
        {
            const orderToDelete = await Order.findByIdAndDelete(request.params.orderId)
            response.send(orderToDelete)
        }
        else
        {
            const errorObject = {
                response: "(orderId) provided in the request parameter does not exist."
            }
            response.send(errorObject)
        }
    }
    catch (err)
    {
        response.json(err)
    }
})




module.exports = router;