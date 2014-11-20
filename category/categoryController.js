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

  var newCategory = new categoryModel(newCategoryInfo);
  categoryModel.create(newCategory, next);
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