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
    }
  };

  // Only create if the location name doesn't already exist in the DB
  locationModel.findOne({ 'name': newLocationInfo.name }, function(err, locationDoc) {
    if(err || !locationDoc) {
      var newLocation = new locationModel(newLocationInfo);
      locationModel.create(newLocation, next);
    } else {
      // Return the already created location since it exists
      res.json(locationDoc);
    }
  });
};

exports.updateOneLocation = function(req, res, next) {
  req.locationDoc.name = req.body.name;
  req.locationDoc.description = req.body.description;
  req.locationDoc.address.street = req.body.address.street;
  req.locationDoc.address.city = req.body.address.city;
  req.locationDoc.address.state = req.body.address.state;
  req.locationDoc.address.zip = req.body.address.zip;
  req.locationDoc.save(next);
};

exports.deleteOneLocation = function(req, res, next) {
  req.locationDoc.remove(next);
};