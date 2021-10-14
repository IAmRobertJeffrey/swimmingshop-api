const { request } = require('express');
const express = require('express')
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/checkAuth')

router.get('/', checkAuth, async (request, result) =>
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

router.get('/:userId', checkAuth, async (request, result) =>
{
    try{
        const user = await User.findById(request.params.userId)
        if(user) {
            result.json(user)
        }
        else
        {
            const errorObject =
            {
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

router.post('/login', async (request, result) =>
{
    try
    {
        if(request.body.username && request.body.userPassword)
        {
            const user = await User.find({ username: request.body.username, userPassword: request.body.userPassword})
            .exec()
            .then(users => 
            {
                if(users[0])
                {
                    const token = jwt.sign({
                        email: users[0].userEmail,
                        username: users[0].username
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn:"1h"
                    })
                  return result.status(200).json(
                    {
                        token:token,
                        message:"Authorization Successful"
                    })
                }
                else
                {
                    result.json("Credentials do not match our records.")
                }
            })         
        }
        else
        {
            result.json("either username or password not provided.")
        }

    }
    catch(err)
    {
        result.json(err);
    }
})

router.post('/', checkAuth, async(request, result) =>
{
    if(request.body.username && request.body.userPassword && request.body.userEmail)
    {
        const newUser = new User({
            username: request.body.username,
            userPassword: request.body.userPassword,
            userEmail: request.body.userEmail
        });
        
        try 
        {
            const users = await User.find(
            {
                $or:
                [
                    {
                        username: request.body.username
                    },
                    {
                        userEmail: request.body.userEmail
                    }
                ]
            }) 
            console.log(users);
           
                if(users.length > 0)
                {  
                    let usernameCheck = "";
                    let userEmailCheck = "";
                    users.forEach(current => 
                    {
                        if(request.body.username === current.username)
                        {
                            usernameCheck = "Username already exists. ";
                        }
                        if(request.body.userEmail === current.userEmail)
                        {
                            userEmailCheck = "Email already exists. ";
                        }
                    })
                    result.json(usernameCheck + userEmailCheck)
                }
                else
                {
                    const savedUser = await newUser.save();
                    result.json(savedUser)
                
                }     
        }
        catch(error)
        {
            result.json(error)
        }   
    }
    else
    {
        result.json("username, password or email not entered")
    }
})

router.delete('/:userId', checkAuth , async (request, result) =>
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

router.patch('/:userId', checkAuth, async (request, result) =>
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
    }
    catch (err)
    {
        result.json(err)
    }

})

module.exports = router;