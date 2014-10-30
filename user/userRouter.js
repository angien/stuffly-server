var express = require('express');
var userRouter = express.Router();
var userController = require('./userController');

// GET localhost:8000/api/user
// 
userRouter.route('/')
    .post(function(req, res)
    {
    	// function(err, created_doc) is passed as "next" argument for createOneUser() defined in userController
    	// this is usually referred as callback function, 
    	// in this case, function(err_created_doc) must match the callback of Mongoose's create()
        userController.createOneUser(res, req, function(err, created_doc)
        {
        	if(err)
        	{
        		res.status(status).send("could not create user");
        	}

        	else
        	{

        		res.json(created_doc);
        	}
        });

    });

// localhost:8000/api/user/friends
// userRouter.route('/friends')

module.exports = userRouter;
