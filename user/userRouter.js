var express = require('express');
var userRouter = express.Router();
var userController = require('./userController');

/*
  Parses the parameter :userid in URL of form /api/user/:userid, then executes
  the original route function (next). Use the parsed id to query db for object
 */
userRouter.param('userid', function(req, res, next, id) {
  req.userId = id;

  userController.getOneUser(req, res, function(err, user) {
    if(err) {
      return next(err);
    }

    req.userDoc = user;
    return next();
  });
});

/*
  GET
  /api/user
  Returns all users
 */
userRouter.route('/').get(function(req, res) {
  userController.getAllUsers(req, res, function(err, users) {
    if(err) {
      res.send("could not get all users");
    } else {
      res.json(users);
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
  // Populate the posts array in the user document
  // req.userDoc.populate('posts', function(err, user) {
  //   res.json(user);
  // });
});

/*
  POST
  /api/user
  Creates a new user given an input body of firstname, lastname, email, password
  Use this for registering users
 */
userRouter.route('/').post(function(req, res) {
  /* function(err, createdUser) is passed as "next" argument for createOneUser()
   defined in userController. This is usually referred as callback function.
   In this case, function(err, createdUser) must match the callback of Mongoose's create(). */
  userController.createOneUser(req, res, function(err, createdUser) {
    if(err) {
      res.send("could not create user");
    } else {
      res.json(createdUser);
    }
  });
});

/*
  POST
  /api/user/login
  Tries to login a user given input email and password
 */
userRouter.route('/login').post(function(req, res) {
  userController.loginOneUser(req, res);
});

/*
  PUT
  /api/user/:userid
  Updates an existing user given an input body of firstname, lastname, email, password, imageUrl
 */
userRouter.route('/:userid').put(function(req, res) {

  userController.updateOneUser(req, res, function(err, updatedUser) {
    if(err) {
      res.send("could not update user with id " + req.userDoc._id);
    } else {
      res.json(updatedUser);
    }
  });
});

/*
  DELETE
  /api/user/:userid
  Deletes a user given the id
  TODO: Delete all the posts made by specified user
 */
userRouter.route('/:userid').delete(function(req, res) {
  userController.deleteOneUser(req, res, function(err, deletedUser) {
    if(err)  {
      res.send("could not find user to delete with id " + req.userDoc._id);
    } else {
      res.json(deletedUser);
    }
  });
});

/*
  GET
  /api/user/:userid/offers
  Gets the offers this user has made
 */
userRouter.route('/:userid/offers').get(function(req, res) {
  userController.getUserOffers(req, res, function(err, offerDocs) {
    if(err) {
      res.send("could not find offers for this user");
    } else {
      res.json(offerDocs);
    }
  });
});

module.exports = userRouter;
