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

/*
  Testing CRUD requests on /api/post
 */
describe("Post: POST GET PUT DELETE requests", function() {
  // Create the user
  var createdUser;

  // Data to POST a user
  var newUserInfo = {
    'firstname': 'Michael',
    'lastname': 'Luo',
    'email': 'mzluo@ucsd.edu'
  };

  // Set up by inserting user into db
  beforeEach(function(done) {
    request(buildOptions(userUrl, 'POST', newUserInfo), function(err, res, body) {
      createdUser = JSON.parse(body);

      done();
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
    "name": "Amazon",
    "description": "Kindle, Fire Phone, Echo, and other Amazon products."
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
    "name": "UC San Diego",
    "description": "One of the world's leading public research universities",
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
  var deletedPost;

  // Data to pass into requests for posts
  var buildNewPostInfo = function(userid, categories, location) {
    return {
      "user": userid,
      "title": "Amazon Echo",
      "description": "Amazon Echo is designed around your voice.",
      "price": 100,
      "categories": categories,
      "location": location,
      "condition": "New"
    };
  };

  var buildUpdatedPostInfo = function(userid, categories, location) {
    return {
      "user": userid,
      "title": "Kindle Voyage",
      "description": "Next-Gen Paperwhite Display, Highest-Resolution.",
      "price": 219,
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

      /*
        Test POST
        /api/post
        Created a new post
       */
      expect(createdPost.user).toEqual(newPostInfo.user);
      expect(createdPost.title).toEqual(newPostInfo.title);
      expect(createdPost.description).toEqual(newPostInfo.description);
      expect(createdPost.price).toEqual(newPostInfo.price);
      expect(createdPost.categories).toEqual(newPostInfo.categories);
      expect(createdPost.location).toEqual(newPostInfo.location);
      expect(createdPost.condition).toEqual(newPostInfo.condition);

      done();
    });
  });

  // Tear down by removing posts from db
  afterEach(function(done) {
    request(buildOptions(postUrl + '/' + createdPost._id, 'DELETE'), function(err, res, body) {
      expect(err).toBe(null);

      deletedPost = JSON.parse(body);

      // Reset variables
      createdPost = {};
      deletedPost = {};

      done();
    });
  });

  ////////////////////////////////
  //ALL THE TEST CASES FOR POSTS//
  ////////////////////////////////

  /*
    PUT
    /api/post/:postid
    Updates an existing post given an input body
   */
  it("should PUT and get back updated post", function(done) {
    var updatedPostInfo = buildUpdatedPostInfo(createdUser._id, [createdCategory._id], createdLocation._id);

    request(buildOptions(postUrl + '/' + createdPost._id, 'PUT', updatedPostInfo), function(err, res, body) {
      var updatedPost = JSON.parse(body);

      expect(updatedPost.user).toEqual(updatedPostInfo.user);
      expect(updatedPost.title).toEqual(updatedPostInfo.title);
      expect(updatedPost.description).toEqual(updatedPostInfo.description);
      expect(updatedPost.price).toEqual(updatedPostInfo.price);
      expect(updatedPost.categories).toEqual(updatedPostInfo.categories);
      expect(updatedPost.location).toEqual(updatedPostInfo.location);
      expect(updatedPost.condition).toEqual(updatedPostInfo.condition);
      expect(updatedPost.updated).not.toEqual(createdPost.updated);

      done();
    });
  });

  /*
    GET
    /api/post/
    Get all posts
   */
  it("should GET all posts", function(done) {
    request(buildOptions(postUrl, 'GET'), function(err, res, body) {
      var posts = JSON.parse(body);

      // Find the post we created to make sure it's in db
      for(var idx = 0; idx < posts.length; ++idx) {
        if(posts[idx]._id === createdPost._id) {
          expect(posts[idx]).toEqual(createdPost);
          break;
        }
      }

      done();
    });
  });

  /*
    GET
    /api/post/:postid
    Returns one post given the id
   */
  it("should GET one post", function(done) {
    request(buildOptions(postUrl + '/' + createdPost._id, 'GET'), function(err, res, body) {
      var post = JSON.parse(body);

      expect(post.user._id).toEqual(createdPost.user);
      expect(post.title).toEqual(createdPost.title);
      expect(post.description).toEqual(createdPost.description);
      expect(post.price).toEqual(createdPost.price);
      expect(post.categories[0]._id).toEqual(createdPost.categories[0]);
      expect(post.location._id).toEqual(createdPost.location);
      expect(post.condition).toEqual(createdPost.condition);

      done();
    });
  });

});