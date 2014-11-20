var request = require('request');
var url = 'http://localhost:8000/api/user';

// Return json of options for http requests
var buildOptions = function(url, method, form) {
  return {
    'url': url,
    'method': method,
    'form': form
  };
};

/*
  Testing CRUD requests on /api/user
 */
describe("User: POST GET PUT DELETE requests", function() {
  // Holds the created and deleted users from beforeEach and afterEach
  var createdUser;
  var deletedUser;

  // Data to POST a user
  var newUserInfo = {
    'firstname': 'Michael',
    'lastname': 'Luo',
    'email': 'mzluo@ucsd.edu'
  };

  // Data to PUT a user
  var updatedUserInfo = {
    'firstname': 'Ryan',
    'lastname': 'Liao',
    'email': 'rliao@ucsd.edu'
  };

  // Set up by inserting into db
  beforeEach(function(done) {
    request(buildOptions(url, 'POST', newUserInfo), function(err, res, body) {
      createdUser = JSON.parse(body);

      /*
        Test POST
        /api/user
        Created a new user
       */
      expect(createdUser.firstname).toEqual(newUserInfo.firstname);
      expect(createdUser.lastname).toEqual(newUserInfo.lastname);
      expect(createdUser.email).toEqual(newUserInfo.email);

      done();
    });
  });

  // Tear down by removing from db
  afterEach(function(done) {
    request(buildOptions(url + '/' + createdUser._id, 'DELETE'), function(err, res, body) {
      expect(err).toBe(null);

      deletedUser = JSON.parse(body);

      // Reset variables
      createdUser = {};
      deletedUser = {};

      done();
    });
  });

  ////////////////////////////////
  //ALL THE TEST CASES FOR USERS//
  ////////////////////////////////

  /*
    PUT
    /api/user/:userid
    Updates an existing user given an input body of firstname, lastname, email
   */
  it("should PUT and get back updated user", function(done) {
    request(buildOptions(url + '/' + createdUser._id, 'PUT', updatedUserInfo), function(err, res, body) {
      var updatedUser = JSON.parse(body);

      expect(updatedUser.firstname).toEqual(updatedUserInfo.firstname);
      expect(updatedUser.lastname).toEqual(updatedUserInfo.lastname);
      expect(updatedUser.email).toEqual(updatedUserInfo.email);

      done();
    });
  });

  /*
    GET
    /api/user/
    Get all users
   */
  it("should GET all users", function(done) {
    request(buildOptions(url, 'GET'), function(err, res, body) {
      var users = JSON.parse(body);

      // Find the user we created to make sure it's in db
      for(var idx = 0; idx < users.length; ++idx) {
        if(users[idx]._id === createdUser._id) {
          expect(users[idx]).toEqual(createdUser);
          break;
        }
      }

      done();
    });
  });

  /*
    GET
    /api/user/:userid
    Returns one user given the id
   */
  it("should GET one user", function(done) {
    request(buildOptions(url + '/' + createdUser._id, 'GET'), function(err, res, body) {
      var user = JSON.parse(body);

      expect(user).toEqual(createdUser);

      done();
    });
  });

});