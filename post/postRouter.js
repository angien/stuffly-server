var express = require('express');
var postRouter = express.Router();
var postController = require('./postController.js');

/*
  Parses the parameter :postid in URL of form /api/post/:postid, then executes
  the original route function (next). Use the parsed id to query db for object
 */
postRouter.param('postid', function(req, res, next, id) {
  req.postId = id;

  postController.getOnePost(req, res, function(err, doc) {
    if(err) {
      return next(err);
    }

    req.postDoc = doc;
    return next();
  });
});

/*
  GET
  /api/post
  Returns all posts
 */
postRouter.route('/').get(function(req, res) {
  postController.getAllPosts(req, res, function(err, posts) {
    if(err) {
      res.send("could not get all posts");
    } else {
      res.json(posts);
    }
  });
});

/*
  GET
  /api/post/:postid
  Returns one post given the id
 */
postRouter.route('/:postid').get(function(req, res) {
  // Populate the user, categories array, and location in the post document
  req.postDoc.populate('user categories location', function(err, post) {
    res.json(post);
  });
});

/*
  POST
  /api/post
  Creates a new post given an input body
 */
postRouter.route('/').post(function(req, res) {
  postController.createOnePost(req, res, function(err, createdPost) {
    if(err) {
      res.send("could not create post");
    } else {
      req.postId = createdPost._id;

      // * When a post is created, we want the other models' documents' to have a reference to it
      // Get the user connected to this post so we can push to user's posts array
      req.userId = createdPost.user;
      postController.populateUserModelPosts(req, res);

      // Get the location connected to this post so we can push to location's posts array
      req.locationId = createdPost.location;
      postController.populateLocationModelPosts(req, res);

      // Get the categories connected to this post so we can push to each category's array
      req.categoryIds = createdPost.categories;
      postController.populateCategoriesModelPosts(req, res);

      // Return the created post while the populate*ModelPosts functions asynchronously execute
      res.json(createdPost);
    }
  });
});

/*
  PUT
  /api/post/:postid
  Updates an existing post given an input body
 */
postRouter.route('/:postid').put(function(req, res) {
  // * When a post is updated, we want the other models' documents' to update their
  // references to user or location or category - if needed, so we delete first and let update fix it
  postController.pullPostsFromModels(req, res);

  postController.updateOnePost(req, res, function(err, updatedPost) {
    if(err) {
      res.send("could not update post with id " + req.postDoc._id);
    } else {
      req.postId = updatedPost._id;

      // Get the user connected to this post so we can update it
      req.userId = updatedPost.user;
      postController.populateUserModelPosts(req, res);

      // Get the location connected to this post so we can update it
      req.locationId = updatedPost.location;
      postController.populateLocationModelPosts(req, res);

      // Get the categories connected to this post so we can update it
      req.categoryIds = updatedPost.categories;
      postController.populateCategoriesModelPosts(req, res);

      res.json(updatedPost);
    }
  });
});

/*
  DELETE
  /api/post/:postid
  Deletes a post given the id
 */
postRouter.route('/:postid').delete(function(req, res) {
  postController.deleteOnePost(req, res, function(err, deletedPost) {
    if(err)  {
      res.send("could not find post to delete with id " + req.postDoc._id);
    } else {
      res.json(deletedPost);
    }
  });
});

module.exports = postRouter;