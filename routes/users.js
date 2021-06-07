const express = require('express')
const router = express.Router();
const User = require('../models/user')

router.get('/', async (request, result) =>
{
    try{
        const users = await User.find();
        result.json(users);
    }
    catch(err)
    {
        result.json({message:err});
    }
})

router.get('/:userId', async (request, result) =>
{
    try{
        const user = await User.findById(request.params.userId)
        if(user) {
            result.json(user)
        }
        else
        {
            const errorObject = {
                response: "The provided (userId) from the request parameter does not exist."
            }
            result.json(errorObject)
        }
    }
    catch(err)
    {
        result.json(err);
    }
})

router.post('/', async(request, result) =>
{
    const newUser = new User({
        username: request.body.username,
        userPassword: request.body.userPassword,
        userEmail: request.body.userEmail
    });

    try {
        const savedUser = await newUser.save();
        result.json(savedUser)
    }
    catch(err)
    {
        result.json(err)
    }
})

router.delete('/:userId', async (request, result) =>
{
    try
    {
        const deletedUser = await User.findByIdAndDelete(request.params.userId)
        if(deletedUser) {
            result.send(deletedUser)
        }
        else
        {
            const errorObject = {
                response: "(userId) provided in the request parameter does not exist"
            }
            result.send(errorObject)
        }
    }
    catch(err)
    {
        result.json(err);
    }
})

router.patch('/:userId', async (request, result) =>
{
    try
    {
        let updatedUser = {}
        const user = await User.findById(request.params.userId)
        if(user)
        {
            if (request.body.username)
            {
                updatedUser = await User.findByIdAndUpdate(request.params.userId, {
                    username: request.body.username,
                }, {new: true, useFindAndModify: false});
            }
            if (request.body.userPassword)
            {
                updatedUser = await User.findByIdAndUpdate(request.params.userId, {
                    userPassword: request.body.userPassword,
                }, {new: true, useFindAndModify: false});
            }
            if (request.body.userEmail)
            {
                updatedUser = await User.findByIdAndUpdate(request.params.userId, {
                    userEmail: request.body.userEmail,
                }, {new: true, useFindAndModify: false});
            }
            if(request.body.username || request.body.userPassword || request.body.userEmail) {
                result.json(updatedUser);
            }
            else
            {
                const errorObject =
                    {
                        response: "No data was updated, nothing found in request body."
                    }
                result.json(errorObject)
            }
        }
        else
        {
            const errorObject =
                {
                    response: "(userId) provided in the request parameter does not exist"
                }
            result.json(errorObject)
        }

        // const updatedUser = await User.updateOne(
        //     {_id: request.params.userId},
        //     {
        //         $set:
        //             {
        //                 username: request.body.username
        //             }
        //     });


    }
    catch (err)
    {
        result.json(err)
    }

})

module.exports = router;