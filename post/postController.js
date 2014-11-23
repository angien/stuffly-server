var postModel = require('./postModel');
var userModel = require('../user/userModel');
var locationModel = require('../location/locationModel');
var categoryModel = require('../category/categoryModel');
var offerModel = require('../offer/offerModel');

exports.getAllPosts = function(req, res, next) {
  postModel.find(next);
};

exports.getOnePost = function(req, res, next) {
  postModel.findById(req.postId, next);
};

exports.createOnePost = function(req, res, next) {
  var newPostInfo = {
    'user' : req.body.user,
    'title' : req.body.title,
    'description' : req.body.description,
    'price' : req.body.price,
    'categories' : req.body.categories,
    'location' : req.body.location,
    'condition' : req.body.condition
  };

  var newPost = new postModel(newPostInfo);

  postModel.create(newPost, next);
};

exports.updateOnePost = function(req, res, next) {
  req.postDoc.user = req.body.user;
  req.postDoc.title = req.body.title;
  req.postDoc.description = req.body.description;
  req.postDoc.price = req.body.price;
  req.postDoc.categories = req.body.categories;
  req.postDoc.location = req.body.location;
  req.postDoc.condition = req.body.condition;
  req.postDoc.updated = Date.now();
  req.postDoc.save(next);
};

exports.deleteOnePost = function(req, res, next) {
  req.postDoc.remove(next);
};

// Find the user model given the user's id and then push the post id to user's posts array
exports.populateUserModelPosts = function(req, res) {
  userModel.findByIdAndUpdate(
    req.userId,
    { $push: { 'posts': req.postId } },
    { safe: true, upsert: true },
    function(err, model) {
      if(err) {
        console.log(err);
      }
    }
  );
};

// Find the location model given the location's id and then push the post id to location's posts array
exports.populateLocationModelPosts = function(req, res) {
  locationModel.findByIdAndUpdate(
    req.locationId,
    { $push: { 'posts': req.postId } },
    { safe: true, upsert: true },
    function(err, model) {
      if(err) {
        console.log(err);
      }
    }
  );
};

// Find the category model given the category's id and then push the post id to category's posts array
exports.populateCategoriesModelPosts = function(req, res) {
  for(var idx = 0; idx < req.categoryIds.length; ++idx) {
    categoryModel.findByIdAndUpdate(
      req.categoryIds[idx],
      { $push: { 'posts': req.postId } },
      { safe: true, upsert: true },
      function(err, model) {
        if(err) {
          console.log(err);
        }
      }
    );
  }
};

exports.pullPostsFromModels = function(req, res) {
  var userId = req.postDoc.user;
  var locationId = req.postDoc.location;
  var categoryIds = req.postDoc.categories;
  var thisPostId = req.postDoc._id;

  userModel.findByIdAndUpdate(
    userId,
    { $pull: { 'posts': thisPostId } },
    { safe: true },
    function(err, model) {
      if(err) {
        console.log(err);
      }
    }
  );

  locationModel.findByIdAndUpdate(
    locationId,
    { $pull: { 'posts': thisPostId } },
    { safe: true },
    function(err, model) {
      if(err) {
        console.log(err);
      }
    }
  );

  for(var idx = 0; idx < categoryIds.length; ++idx) {
    categoryModel.findByIdAndUpdate(
      categoryIds[idx],
      { $pull: { 'posts': thisPostId } },
      { safe: true },
      function(err, model) {
        if(err) {
          console.log(err);
        }
      }
    );
  }
};