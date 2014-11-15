var express = require('express');
var userRouter = express.Router();
var userController = require('./userController');

// Parse parameter :userid in URL
// Grabs the user object if the URL is /api/user/:userid, then executes 
// the original route function
userRouter
	.param('userid', function(req, res, next, id)
	{
		req.userid = id;

		userController.getOneUser(req, res, function(err, doc)
		{
			if(err)
			{
				return next(err);
			}
			if(!doc)
			{
				return next(new Error("could not get user with id " + id));
			}
			req.user_doc = doc;
			return next();
		});
	});;

// GET localhost:8000/api/user
// Get all users
userRouter.route('/')
    .get(function(req, res)
    {
        userController.getAllUsers(req, res, function(err, docs)
        {
            if(err)
            {
                res.send("could not get all users");
            }
            else
            {
                res.json(docs);
            }
        });
    });

// GET localhost:8000/api/user/:userid
// Get one user
userRouter.route('/:userid')
	.get(function(req, res)
	{
		res.json(req.user_doc);
	});

// POST localhost:8000/api/user
// Create a user
userRouter.route('/')
    .post(function(req, res)
    {
    	// function(err, created_doc) is passed as "next" argument for createOneUser() defined in userController
    	// this is usually referred as callback function, 
    	// in this case, function(err_created_doc) must match the callback of Mongoose's create()
        userController.createOneUser(req, res, function(err, created_doc)
        {
        	if(err)
        	{
        		res.send("could not create user");
        	}
        	else
        	{
        		res.json(created_doc);
        	}
        });

    });

// PUT localhost:8000/api/user/:userid
// Update a user
userRouter.route('/:userid')
	.put(function(req, res)
	{
		userController.updateOneUser(req, res, function(err, updated_doc)
		{
			if(err)
			{
				res.send("could not update user with id " + req.user_doc._id);
			}
			else
			{
				res.json(updated_doc);
			}
		});
	});

// DELETE localhost:8000/api/user/:userid
// Delete a user
userRouter.route('/:userid')
	.delete(function(req, res)
	{
		userController.deleteOneUser(req, res, function(err, deleted_doc)
		{
			if(err)
			{
				res.send("could not find user to delete with id " + req.user_doc._id);
			}
			else
			{
				res.json(deleted_doc);
			}
		});
	})

// localhost:8000/api/user/friends
// userRouter.route('/friends')

module.exports = userRouter;
