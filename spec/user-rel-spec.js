/*
 * Test the relationship between users and posts/locations/categories.
 * i.e. deleting a user should remove all posts by the user in the posts model
 *      and then also delete posts from location and category models
 */

var request = require('request');
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

describe("User: DELETE requests result in posts deleted from other models", function() {
  // Create the user
  var createdUser;

  // Data to POST a user
  var newUserInfo = {
    'firstname': 'Ryan',
    'lastname': 'Liao',
    'email': 'rliao@ucsd.edu'
  };

  // Set up by inserting user into db
  beforeEach(function(done) {
    request(buildOptions(userUrl, 'POST', newUserInfo), function(err, res, body) {
      createdUser = JSON.parse(body);

      done();
    });
  });

  // Tear down by removing user from db
  afterEach(function() {
    // Our tests should have already deleted createdUser so let us just reset variable
    createdUser = {};
  });

  // Create the category
  var createdCategory;

  // Data to POST a category
  var newCategoryInfo = {
    "name": "Music",
    "description": "The latest hit albums."
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
    "name": "Burger King",
    "description": "Price Center",
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
      "title": "ASUS 23 Inch Monitor",
      "description": "A nice monitor.",
      "price": 100,
      "categories": categories,
      "location": location,
      "condition": "Used"
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

  // Tear down by resetting createdPost
  afterEach(function() {
    // Reset variables
    createdPost = {};
  });

  ////////////////////////////////
  //ALL THE TEST CASES FOR USERS//
  ////////////////////////////////

  /*
    After deleting a user, make sure that the posts owned by user are deleted, as well as the posts in
    the 'posts' arrays of location and category models
   */
  it("should result in deleted posts and references 'posts' arrays in user, category, location also deleted", function(done) {
    // Call delete on the user
    request(buildOptions(userUrl + '/' + createdUser._id, 'DELETE'), function(err, res, body) {
      var deletedUser = JSON.parse(body);
      var userPosts = deletedUser.posts;

      // Make sure each user's post is deleted from post model
      request(buildOptions(postUrl + '/' + userPosts[0], 'GET'), function(err, res, body) {
        // Done checking posts, now check category model for post
        var postCategories = createdPost.categories;
        for(var idx = 0; idx < postCategories.length; ++idx) {
          request(buildOptions(categoryUrl + '/' + postCategories[idx], 'GET'), function(err, res, body) {
            var categoryDoc = JSON.parse(body);
            var categoryPosts = categoryDoc.posts;

            var isPostInCategoryPosts = false;

            for(var idx = 0; idx < categoryPosts.length; ++idx) {
              if(categoryPosts[idx]._id === createdPost._id) {
                isPostInCategoryPosts = true;
              }
            }

            expect(isPostInCategoryPosts).toEqual(false);

            // Done checking categories, now check location
            if(idx + 1 == postCategories.length) {
              request(buildOptions(locationUrl + '/' + createdPost.location, 'GET'), function(err, res, body) {
                var locationDoc = JSON.parse(body);
                var locationPosts = locationDoc.posts;

                var isPostInLocationPosts = false;

                for(var idx = 0; idx < locationPosts; ++idx) {
                  if(locationPost[idx]._id === createdPost.location) {
                    isPostInLocationPosts = true;
                  }
                }

                expect(isPostInLocationPosts).toEqual(false);

                done();
              });
            }
          });
        }
      });
    });
  });

});