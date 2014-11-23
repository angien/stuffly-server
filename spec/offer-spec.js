var request = require('request');
var offerUrl = 'http://localhost:8000/api/offer';
var userUrl = 'http://localhost:8000/api/user';
var postUrl = 'http://localhost:8000/api/post';
var categoryUrl = 'http://localhost:8000/api/category';
var locationUrl = 'http://localhost:8000/api/location';

// Return json of options for http requests
var buildOptions = function(url, method, form) {
  return {
    'url': url,
    'method': method,
    'form': form
  };
};

/*
  Testing CRUD requests on /api/offer
 */
describe("Offer: POST GET PUT DELETE requests", function() {
  // Create the user
  var createdUser;
  var anotherCreatedUser;

  // Data to POST a user
  var newUserInfo = {
    'firstname': 'Claire',
    'lastname': 'Li',
    'email': 'cli@ucsd.edu'
  };

  var anotherNewUserInfo = {
    'firstname': 'Michael',
    'lastname': 'Luo',
    'email': 'mzluo@ucsd.edu'
  };

  // Set up by inserting two users into db
  beforeEach(function(done) {
    request(buildOptions(userUrl, 'POST', newUserInfo), function(err, res, body) {
      createdUser = JSON.parse(body);

      request(buildOptions(userUrl, 'POST', anotherNewUserInfo), function(err, res, body) {
        anotherCreatedUser = JSON.parse(body);

        done();
      });
    });
  });

  // Tear down by removing user from db
  afterEach(function(done) {
    request(buildOptions(userUrl + '/' + createdUser._id, 'DELETE'), function(err, res, body) {
      expect(err).toBe(null);

      // Reset variables
      createdUser = {};

      request(buildOptions(userUrl + '/' + anotherCreatedUser._id, 'DELETE'), function(err, res, body) {
        expect(err).toBe(null);
        anotherCreatedUser = {};

        done();
      });
    });
  });

  // Create the category
  var createdCategory;

  // Data to POST a category
  var newCategoryInfo = {
    "name": "Home Automation",
    "description": "Robots and Stuff."
  };

  // Set up by inserting category into db
  beforeEach(function(done) {
    request(buildOptions(categoryUrl, 'POST', newCategoryInfo), function(err, res, body) {
      createdCategory = JSON.parse(body);

      done();
    });
  });

  // Tear down by removing category from db
  afterEach(function(done) {
    request(buildOptions(categoryUrl + '/' + createdCategory._id, 'DELETE'), function(err, res, body) {
      expect(err).toBe(null);

      // Reset variables
      createdCategory = {};

      done();
    });
  });

  // Create the location
  var createdLocation;

  // Data to POST a location
  var newLocationInfo = {
    "name": "Trieste",
    "description": "A building complex in La Jolla",
    "address": {
      "street": "123 Fake Street",
      "city": "La Jolla",
      "state": "CA",
      "zip": "92093"
    }
  };

  // Set up by inserting location into db
  beforeEach(function(done) {
    request(buildOptions(locationUrl, 'POST', newLocationInfo), function(err, res, body) {
      createdLocation = JSON.parse(body);

      done();
    });
  });

  // Tear down by removing location from db
  afterEach(function(done) {
    request(buildOptions(locationUrl + '/' + createdLocation._id, 'DELETE'), function(err, res, body) {
      expect(err).toBe(null);

      // Reset variables
      createdLocation = {};

      done();
    });
  });

  // Create the post
  var createdPost;

  // Data to pass into requests for posts
  var buildNewPostInfo = function(userid, categories, location) {
    return {
      "user": userid,
      "title": "HTC One",
      "description": "A really awesome Android phone.",
      "price": 400,
      "categories": categories,
      "location": location,
      "condition": "New"
    };
  };

  // Set up by inserting posts into db
  beforeEach(function(done) {
    var newPostInfo = buildNewPostInfo(createdUser._id, [createdCategory._id], createdLocation._id);

    request(buildOptions(postUrl, 'POST', newPostInfo), function(err, res, body) {
      createdPost = JSON.parse(body);

      done();
    });
  });

  // Tear down by removing posts from db
  afterEach(function(done) {
    request(buildOptions(postUrl + '/' + createdPost._id, 'DELETE'), function(err, res, body) {
      expect(err).toBe(null);

      // Reset variables
      createdPost = {};
      deletedPost = {};

      done();
    });
  });

  // Create the offer
  var createdOffer;

  // Data to pass into request for offers
  var buildNewOfferInfo = function(offeredBy, offeredTo, price) {
    return {
      "offeredBy": offeredBy,
      "offeredTo": offeredTo,
      "price": price
    };
  };

  // Set up by inserting offers into db
  beforeEach(function(done) {
    var newOfferInfo = buildNewOfferInfo(anotherCreatedUser._id, createdPost._id, 169);

    request(buildOptions(offerUrl, 'POST', newOfferInfo), function(err, res, body) {
      createdOffer = JSON.parse(body);

      /*
        Test POST
        /api/offer
        Created a new offer
       */
       expect(createdOffer.offeredBy).toEqual(newOfferInfo.offeredBy);
       expect(createdOffer.offeredTo).toEqual(newOfferInfo.offeredTo);
       expect(createdOffer.price).toEqual(newOfferInfo.price);

       done();
    })
  });

  // Tear down by removing offer from db
  afterEach(function(done) {
    request(buildOptions(offerUrl + '/' + createdOffer._id, 'DELETE'), function(err, res, body) {
      expect(err).toBe(null);

      createdOffer = {};

      done();
    })
  });

  /*
    GET
    /api/offers/
    Get all offers
   */
  it("should GET all offers", function(done) {
    request(buildOptions(offerUrl, 'GET'), function(err, res, body) {
      var offers = JSON.parse(body);

      // Find the offer we created to make sure it's in db
      for(var idx = 0; idx < offers.length; ++idx) {
        if(offers[idx]._id === createdOffer._id) {
          expect(offers[idx]).toEqual(createdOffer);
          break;
        }
      }

      done();
    });
  });

  /*
    GET
    /api/offer/:offerid
    Returns one offer given the id
   */
  it("should GET one offer", function(done) {
    request(buildOptions(offerUrl + '/' + createdOffer._id, 'GET'), function(err, res, body) {
      var offer = JSON.parse(body);

      expect(offer.offeredBy._id).toEqual(anotherCreatedUser._id);
      expect(offer.offeredTo._id).toEqual(createdPost._id);
      expect(offer.price).toEqual(createdOffer.price);

      done();
    });
  });



});