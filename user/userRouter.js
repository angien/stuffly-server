var express = require('express');
var userRouter = express.Router();
var userController = require('./userController');

/*
  Parses the parameter :userid in URL of form /api/user/:userid, then executes
  the original route function (next). Use the parsed id to query db for object
 */
userRouter.param('userid', function(req, res, next, id) {
  req.userId = id;

  userController.getOneUser(req, res, function(err, doc) {
    if(err) {
      return next(err);
    }

    if(!doc) {
      return next(new Error("could not get user with id " + req.userId));
    }

    req.userDoc = doc;
    return next();
  });
});

/*
  GET
  /api/user
  Returns all users
 */
userRouter.route('/').get(function(req, res) {
  userController.getAllUsers(req, res, function(err, docs) {
    if(err) {
      res.send("could not get all users");
    }
    else {
      res.json(docs);
    }
  });
});

/*
  GET
  /api/user/:userid
  Returns one user given the id
 */
userRouter.route('/:userid').get(function(req, res) {
  res.json(req.userDoc);
});


/*
  POST
  /api/user
  Creates a new user given an input body of firstname, lastname, email
 */
userRouter.route('/').post(function(req, res) {
  /* function(err, createdDoc) is passed as "next" argument for createOneUser()
   defined in userController. This is usually referred as callback function.
   In this case, function(err, createdDoc) must match the callback of Mongoose's create(). */
  userController.createOneUser(req, res, function(err, createdDoc) {
    if(err) {
      res.send("could not create user");
    }
    else {
      res.json(createdDoc);
    }
  }); 
});

/*
  PUT
  /api/user/:userid
  Updates an existing user given an input body of firstname, lastname, email
 */
userRouter.route('/:userid').put(function(req, res) {

  userController.updateOneUser(req, res, function(err, updatedDoc) {
    if(err) {
      res.send("could not update user with id " + req.userDoc._id);
    }
    else {
      res.json(updatedDoc);
    }
  });
});

/*
  DELETE
  /api/user/:userid
  Deletes a user given the id
 */
userRouter.route('/:userid').delete(function(req, res) {
  userController.deleteOneUser(req, res, function(err, deletedDoc) {
    if(err)  {
      res.send("could not find user to delete with id " + req.userDoc._id);
    }
    else {
      res.json(deletedDoc);
    }
  });
});

// localhost:8000/api/user/:userid/friends
// userRouter.route('/:userid/friends')

module.exports = userRouter;
