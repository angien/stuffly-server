/*
 * Test the relationship between offers and users/posts/offers
 * i.e. creating an offer should populate the 'offers' array of the referenced
 * post, while deleting a post should delete all offers and deleting a user should
 * also delete all offers for that user's posts
 */

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

describe("Offer: POST and GET requests cascading updates on other post model", function() {
  // Create the user
  var createdUser;

  // Data to POST a user
  var newUserInfo = {
    'firstname': 'Angie',
    'lastname': 'Nguyen',
    'email': 'angienguyen@gmail.com'
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

      done();
    });
  });

  // Create the category
  var createdCategory;

  // Data to POST a category
  var newCategoryInfo = {
    "name": "Books",
    "description": "Books and things."
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
    "name": "Geisel Library",
    "description": "UC San Diego's library on Library Walk",
    "address": {
      "street": "9500 Gilman Dr",
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
      "title": "Cracking the Coding Interview",
      "description": "The Bible for CS Majors",
      "price": 31,
      "categories": categories,
      "location": location,
      "condition": "New"
    };
  };

  var buildUpdatedPostInfo = function(userid, categories, location) {
    return {
      "user": userid,
      "title": "Programming Interviews Exposed",
      "description": "Another Bible for CS Majors if you want a job",
      "price": 15,
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

      done();
    })
  });

  // Set up by removing offers into db
  afterEach(function(done) {
    request(buildOptions(offerUrl + '/' + createdOffer._id, 'DELETE'), function(err, res, body) {
      expect(err).toBe(null);

      createdOffer = {};

      done();
    })
  });

  /////////////////////////////////
  //ALL THE TEST CASES FOR OFFERS//
  /////////////////////////////////

  /*
    After creating a new offer, check if post model has correctly pushed to offers array
   */
  it("should result in populated offers array in post model", function(done) {
    // Get post for offers array
    request(buildOptions(postUrl + '/' + createdPost._id, 'GET'), function(err, res, body) {
      var postDoc = JSON.parse(body);
      var postOffers = postDoc.offers;

      var isOfferInPost = false;

      // Check offers array, if this offer is in it
      for(var idx = 0; idx < postOffers.length; ++idx) {
        if(postOffers[idx]._id === createdOffer._id && postOffers[idx].offeredBy === anotherCreatedUser._id) {
          isOfferInPost = true;
        }
      }

      expect(isOfferInPost).toEqual(true);

      done();
    });
  });

  /*
    Deleting a post, check if offer model still contains offer for the post
   */
  it("should remove offers for a deleted post", function(done) {
    request(buildOptions(postUrl + '/' + createdPost._id, 'DELETE'), function(err, res, body) {
      var postDoc = JSON.parse(body);
      var postOffer = postDoc.offers[0];

      request(buildOptions(offerUrl, 'GET'), function(err, res, body) {
        var allOffers = JSON.parse(body);

        var isOfferInModel = false;

        for(var idx = 0; idx < allOffers.length; ++idx) {
          if(allOffers[idx].offeredTo === postOffer) {
            isOfferInModel = true;
            break;
          }
        }

        expect(isOfferInModel).toEqual(false);

        done();
      });
    });
  });

  /*
    Deleting the user who made the post, check if offer model still contains offer for the post
   */
  it("should remove offers for a deleted post again", function(done) {
    request(buildOptions(userUrl + '/' + createdUser._id, 'DELETE'), function(err, res, body) {
      var userDoc = JSON.parse(body);
      var userId = userDoc._id;

      request(buildOptions(offerUrl, 'GET'), function(err, res, body) {

        var allOffers = JSON.parse(body);

        var isUserInModel = false;

        for(var idx = 0; idx < allOffers.length; ++idx) {
          if(allOffers[idx].offeredTo === createdPost._id) {
            isUserInModel = true;
          }
        }

        expect(isUserInModel).toEqual(false);

        done();
      });
    });
  });

  /*
    Deleting the offer should remove it from post's offers array
   */
  it("should remove offer in offers array when offer deleted", function(done) {
    request(buildOptions(offerUrl + '/' + createdOffer._id, 'DELETE'), function(err, res, body) {
      var deletedOffer = JSON.parse(body);
      var offeredToId = deletedOffer.offeredTo;

      // Get the post and check it's 'offers' array, it shouldn't contain this offer
      request(buildOptions(postUrl + '/' + offeredToId, 'GET'), function(err, res, body) {
        var postDoc = JSON.parse(body);
        var postOffers = postDoc.offers;

        var isOfferInPost = false;

        for(var idx = 0; idx < postOffers.length; ++idx) {
          if(postOffers[idx]._id === deletedOffer._id) {
            isOfferInPost = true;
          }
        }

        expect(isOfferInPost).toEqual(false);

        done();
      });
    });
  });

  /*
    Deleting the user who made the offer, check if post contains offer in 'offers' array
    and if offer model contains the offer
   */
  it("should remove offer in offers array and offer model when another user is deleted", function(done) {
    request(buildOptions(userUrl + '/' + anotherCreatedUser._id, 'DELETE'), function(err, res, body) {
      var deletedUser = JSON.parse(body);

      // Get the post and check it's 'offers' array, it shouldn't contain the created offer
      request(buildOptions(postUrl + '/' + createdPost._id, 'GET'), function(err, res, body) {
        var postDoc = JSON.parse(body);
        var postOffers = postDoc.offers;

        var isOfferInPost = false;

        for(var idx = 0; idx < postOffers.length; ++idx) {
          if(postOffers[idx]._id === createdOffer._id) {
            isOfferInPost = true;
          }
        }

        expect(isOfferInPost).toEqual(false);

        // Now check the offer model for the offer
        request(buildOptions(offerUrl, 'GET'), function(err, res, body) {
          var offerDocs = JSON.parse(body);

          var isOfferInOfferModel = false;

          for(var idx = 0; idx < offerDocs.length; ++idx) {
            if(offerDocs[idx]._id === createdOffer._id) {
              isOfferInOfferModel = true;
            }
          }

          expect(isOfferInOfferModel).toEqual(false);

          done();
        });
      });
    });
  });

});