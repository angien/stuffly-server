var categoryModel = require('./categoryModel');

exports.getAllCategories = function(req, res, next) {
  categoryModel.find(next);
};

exports.getOneCategory = function(req, res, next) {
  categoryModel.findById(req.categoryId, next);
};

exports.createOneCategory = function(req, res, next) {
  var newCategoryInfo = {
    name: req.body.name,
    description: req.body.description
  };

  // Only create if the category name doesn't already exist in the DB
  categoryModel.findOne({ 'name': newCategoryInfo.name }, function(err, categoryDoc) {
    if(err || !categoryDoc) {
      var newCategory = new categoryModel(newCategoryInfo);
      categoryModel.create(newCategory, next);
    } else {
      // Return the category since it already exists
      categoryDoc.statusCode = 409; // Duplicate category status code
      res.json(categoryDoc);
    }
  });
};

exports.updateOneCategory = function(req, res, next) {
  req.categoryDoc.name = req.body.name;
  req.categoryDoc.description = req.body.description;
  req.categoryDoc.save(next);
};

exports.deleteOneCategory = function(req, res, next) {
  // TODO: implement removing all posts associated with the category
  req.categoryDoc.remove(next);
};