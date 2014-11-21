var express = require('express');
var locationRouter = express.Router();
var locationController = require('./locationController.js');

/*
  Parses the parameter :locationid in URL of form /api/location/:locationid, then executes
  the original route function (next). Use the parsed id to query db for object
 */
locationRouter.param('locationid', function(req, res, next, id) {
  req.locationId = id;

  locationController.getOneLocation(req, res, function(err, location) {
    if(err) {
      return next(err);
    }

    req.locationDoc = location;
    return next();
  });
});

/*
  GET
  /api/location
  Returns all locations
 */
locationRouter.route('/').get(function(req, res) {
  locationController.getAllLocations(req, res, function(err, locations) {
    if(err) {
      res.send("could not get all locations");
    } else {
      res.json(locations);
    }
  });
});

/*
  GET
  /api/location/:locationid
  Returns one location given the id
 */
locationRouter.route('/:locationid').get(function(req, res) {
  // Populate the posts array in the location document
  req.locationDoc.populate('posts', function(err, location) {
    res.json(location);
  });
});

/*
  POST
  /api/location
  Creates a new location given an input body
 */
locationRouter.route('/').post(function(req, res) {
  locationController.createOneLocation(req, res, function(err, createdLocation) {
    if(err) {
      res.send("could not create location");
    } else {
      res.json(createdLocation);
    }
  });
});

/*
  PUT
  /api/location/:locationid
  Updates an existing location given an input body
 */
locationRouter.route('/:locationid').put(function(req, res) {
  locationController.updateOneLocation(req, res, function(err, updatedLocation) {
    if(err) {
      res.send("could not update location with id " + req.locationDoc._id);
    } else {
      res.json(updatedLocation);
    }
  });
});

/*
  DELETE
  /api/location/:locationid
  Deletes a location given the id
  TODO: Delete all the posts made by specified location
 */
locationRouter.route('/:locationid').delete(function(req, res) {
  locationController.deleteOneLocation(req, res, function(err, deletedLocation) {
    if(err)  {
      res.send("could not find location to delete with id " + req.locationDoc._id);
    } else {
      res.json(deletedLocation);
    }
  });
});

module.exports = locationRouter;