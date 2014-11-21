var express = require('express');
var categoryRouter = express.Router();
var categoryController = require('./categoryController.js');

/*
  Parses the parameter :categoryid in URL of form /api/category/:categoryid, then executes
  the original route function (next). Use the parsed id to query db for object
 */
categoryRouter.param('categoryid', function(req, res, next, id) {
  req.categoryId = id;

  categoryController.getOneCategory(req, res, function(err, category) {
    if(err) {
      return next(err);
    }

    req.categoryDoc = category;
    return next();
  });
});

/*
  GET
  /api/category
  Returns all categories
 */
categoryRouter.route('/').get(function(req, res) {
  categoryController.getAllCategories(req, res, function(err, categories) {
    if(err) {
      res.send("could not get all categories");
    } else {
      res.json(categories);
    }
  });
});

/*
  GET
  /api/category/:categoryid
  Returns one category given the id
 */
categoryRouter.route('/:categoryid').get(function(req, res) {
  // Populate the posts array in the category document
  res.json(req.categoryDoc);
});

/*
  POST
  /api/category
  Creates a new category given an input body. The input category will be filtered,
  (i.e. lowercase, no weird symbols)
 */
categoryRouter.route('/').post(function(req, res) {
  categoryController.createOneCategory(req, res, function(err, createdCategory) {
    if(err) {
      res.send("could not create category");
    } else {
      res.json(createdCategory);
    }
  });
});

/*
  PUT
  /api/category/:categoryid
  Updates an existing category given an input body
 */
categoryRouter.route('/:categoryid').put(function(req, res) {

  categoryController.updateOneCategory(req, res, function(err, updatedCategory) {
    if(err) {
      res.send("could not update category with id " + req.categoryDoc._id);
    } else {
      res.json(updatedCategory);
    }
  });
});

/*
  DELETE
  /api/category/:categoryid
  Deletes a category given the id
  TODO: Delete all the posts in a specified category, also delete posts in user, location
 */
categoryRouter.route('/:categoryid').delete(function(req, res) {
  categoryController.deleteOneCategory(req, res, function(err, deletedCategory) {
    if(err)  {
      res.send("could not find category to delete with id " + req.categoryDoc._id);
    } else {
      res.json(deletedCategory);
    }
  });
});

module.exports = categoryRouter;

