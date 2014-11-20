var request = require('request');
var url = 'http://localhost:8000/api/location';

// Return json of options for http requests
var buildOptions = function(url, method, form) {
  return {
    'url': url,
    'method': method,
    'form': form
  };
};

/*
  Testing CRUD requests on /api/location
 */
describe("Location: POST GET PUT DELETE requests", function() {
  // Holds the created and deleted users from beforeEach and afterEach
  var createdLocation;
  var deletedLocation;

  // Data to POST a location
  var newLocationInfo = {
    "name": "UC San Diego",
    "description": "One of the world's leading public research universities",
    "address": {
      "street": "9500 Gilman Dr",
      "city": "La Jolla",
      "state": "CA",
      "zip": "92093"
    }
  };

  // Data to PUT a location
  var updatedLocationInfo = {
    "name": "MIT",
    "": "Famed private research university founded in 1861",
    "address": {
      "street": "77 Massachusetts Ave",
      "city": "Cambridge",
      "state": "MA",
      "zip": "02139"
    }
  };

  // Set up by inserting location into db
  beforeEach(function(done) {
    request(buildOptions(url, 'POST', newLocationInfo), function(err, res, body) {
      createdLocation = JSON.parse(body);

      /*
        Test POST
        /api/location
        Created a new location
       */
      expect(createdLocation.name).toEqual(newLocationInfo.name);
      expect(createdLocation.description).toEqual(newLocationInfo.description);
      expect(createdLocation.address.street).toEqual(newLocationInfo.address.street);
      expect(createdLocation.address.city).toEqual(newLocationInfo.address.city);
      expect(createdLocation.address.state).toEqual(newLocationInfo.address.state);
      expect(createdLocation.address.zip).toEqual(newLocationInfo.address.zip);

      done();
    });
  });

  // Tear down by removing location from db
  afterEach(function(done) {
    request(buildOptions(url + '/' + createdLocation._id, 'DELETE'), function(err, res, body) {
      expect(err).toBe(null);

      deletedLocation = JSON.parse(body);

      // Reset variables
      createdLocation = {};
      deletedLocation = {};

      done();
    });
  });

  ////////////////////////////////////
  //ALL THE TEST CASES FOR LOCATIONS//
  ////////////////////////////////////

  /*
    PUT
    /api/location/:locationid
    Updates an existing location given an input body
   */
  it("should PUT and get back updated location", function(done) {
    request(buildOptions(url + '/' + createdLocation._id, 'PUT', updatedLocationInfo), function(err, res, body) {
      var updatedLocation = JSON.parse(body);

      expect(updatedLocation.firstname).toEqual(updatedLocationInfo.firstname);
      expect(updatedLocation.lastname).toEqual(updatedLocationInfo.lastname);
      expect(updatedLocation.email).toEqual(updatedLocationInfo.email);

      done();
    });
  });

  /*
    GET
    /api/location/
    Get all locations
   */
  it("should GET all locations", function(done) {
    request(buildOptions(url, 'GET'), function(err, res, body) {
      var locations = JSON.parse(body);

      // Find the location we created to make sure it's in db
      for(var idx = 0; idx < locations.length; ++idx) {
        if(locations[idx]._id === createdLocation._id) {
          expect(locations[idx]).toEqual(createdLocation);
          break;
        }
      }

      done();
    });
  });

  /*
    GET
    /api/location/:locationid
    Returns one location given the id
   */
  it("should GET one location", function(done) {
    request(buildOptions(url + '/' + createdLocation._id, 'GET'), function(err, res, body) {
      var location = JSON.parse(body);

      expect(location).toEqual(createdLocation);

      done();
    });
  });

});