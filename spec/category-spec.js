var request = require('request');
var url = 'http://localhost:8000/api/category';

// Return json of options for http requests
var buildOptions = function(url, method, form) {
  return {
    'url': url,
    'method': method,
    'form': form
  };
};

/*
  Testing CRUD requests on /api/category
 */
describe("Category: POST GET PUT DELETE requests", function() {
  // Holds the created and deleted users from beforeEach and afterEach
  var createdCategory;
  var deletedCategory;

  // Data to POST a category
  var newCategoryInfo = {
    'name': 'Electronics',
    'description': 'Smartphones, laptops, desktops, etc.'
  };

  // Data to PUT a category
  var updatedCategoryInfo = {
    'name': 'Outdoors',
    'description': 'Sweaters, sports equipment, tents, etc.'
  };

  // Set up by inserting category into db
  beforeEach(function(done) {
    request(buildOptions(url, 'POST', newCategoryInfo), function(err, res, body) {
      createdCategory = JSON.parse(body);

      /*
        Test POST
        /api/category
        Created a new category
       */
      expect(createdCategory.name).toEqual(newCategoryInfo.name);
      expect(createdCategory.description).toEqual(newCategoryInfo.description);

      done();
    });
  });

  // Tear down by removing category from db
  afterEach(function(done) {
    request(buildOptions(url + '/' + createdCategory._id, 'DELETE'), function(err, res, body) {
      expect(err).toBe(null);

      deletedCategory= JSON.parse(body);

      // Reset variables
      createdCategory = {};
      deletedCategory = {};

      done();
    });
  });

  /////////////////////////////////////
  //ALL THE TEST CASES FOR CATEGORIES//
  /////////////////////////////////////

  /*
    PUT
    /api/category/:categoryid
    Updates an existing category given an input body
   */
  it("should PUT and get back updated category", function(done) {
    request(buildOptions(url + '/' + createdCategory._id, 'PUT', updatedCategoryInfo), function(err, res, body) {
      var updatedCategory = JSON.parse(body);

      expect(updatedCategory.name).toEqual(updatedCategoryInfo.name);
      expect(updatedCategory.description).toEqual(updatedCategoryInfo.description);

      done();
    });
  });

  /*
    GET
    /api/category/
    Get all categories
   */
  it("should GET all categories", function(done) {
    request(buildOptions(url, 'GET'), function(err, res, body) {
      var categories = JSON.parse(body);

      // Find the category we created to make sure it's in db
      for(var idx = 0; idx < categories.length; ++idx) {
        if(categories[idx]._id === createdCategory._id) {
          expect(categories[idx]).toEqual(createdCategory);
          break;
        }
      }

      done();
    });
  });

  /*
    GET
    /api/category/:categoryid
    Returns one category given the id
   */
  it("should GET one category", function(done) {
    request(buildOptions(url + '/' + createdCategory._id, 'GET'), function(err, res, body) {
      var category = JSON.parse(body);

      expect(category).toEqual(createdCategory);

      done();
    });
  });

});