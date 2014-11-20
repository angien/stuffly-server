var locationModel = require('./locationModel');

exports.getAllLocations = function(req, res, next) {
  locationModel.find(next);
};

exports.getOneLocation = function(req, res, next) {
  locationModel.findById(req.locationId, next);
};

exports.createOneLocation = function(req, res, next) {
  var newLocationInfo = {
    name: req.body.name,
    description: req.body.description,
    address: {
      street: req.body.address.street,
      city: req.body.address.city,
      state: req.body.address.state,
      zip: req.body.address.zip,
      state: req.body.address.state
    }
  };

  var newLocation = new locationModel(newLocationInfo);
  locationModel.create(newLocation, next); 
};

exports.updateOneLocation = function(req, res, next) {
  req.locationDoc.firstname = req.body.firstname;
  req.locationDoc.lastname = req.body.lastname;
  req.locationDoc.email = req.body.email;
  req.locationDoc.save(next);
};

exports.deleteOneLocation = function(req, res, next) {
  req.locationDoc.remove(next);
};