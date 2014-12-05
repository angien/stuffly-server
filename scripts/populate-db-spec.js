// This script deletes all docs from the stuffly DB and populates it with fake data

var request = require("request");
var userUrl = "http://localhost:8000/api/user";
var locationUrl = "http://localhost:8000/api/location";
var categoryUrl = "http://localhost:8000/api/category";
var postUrl = "http://localhost:8000/api/post";
var offerUrl = "http://localhost:8000/api/offer";

// Return json of options for http requests
var buildOptions = function(url, method, form) {
  return {
    "url": url,
    "method": method,
    "form": form
  };
};

/*
  Creating user data
 */
describe("Populating DB", function() {
  // The initial list of objects that we want to clear from the db
  var initialUsers = [];
  var initialLocations = [];
  var initialCategories = [];
  var initialPosts = [];
  var initialOffers = [];

  // Holds the created objects
  var createdUsers = [];
  var createdLocations = [];
  var createdCategories = [];
  var createdPosts = [];
  var createdOffers = [];

  // Data to POST users
  var newUserInfos = [{
    "firstname": "Michael",
    "lastname": "Luo",
    "email": "michael@gmail.com",
    "password": "password"
  },
  {
    "firstname": "Ryan",
    "lastname": "Liao",
    "email": "ryan@gmail.com",
    "password": "password"
  },
  {
    "firstname": "Angie",
    "lastname": "Nguyen",
    "email": "angie@gmail.com",
    "password": "password"
  },
  {
    "firstname": "Andrew",
    "lastname": "Sie",
    "email": "andrew@gmail.com",
    "password": "password"
  },
  {
    "firstname": "Jamie",
    "lastname": "Yang",
    "email": "jamie@gmail.com",
    "password": "password"
  },
  {
    "firstname": "Tansen",
    "lastname": "Zhu",
    "email": "tansen@gmail.com",
    "password": "password"
  },
  {
    "firstname": "Tester",
    "lastname": "One",
    "email": "testerone@gmail.com",
    "password": "testerone"
  },
  {
    "firstname": "Tester",
    "lastname": "Tester",
    "email": "tester@gmail.com",
    "password": "tester"
  }];

  // Data to POST locations
  var newLocationInfos = [{
    "name" : "UCSD",
    "description" : "University of California, San Diego",
    "address" : {
        "street" : "9450 Gilman Drive",
        "city" : "La Jolla",
        "state" : "CA",
        "zip" : "92092"
    }
  }];

  // Data to POST categories
  var newCategoryInfos = [
  {
    "name": "Electronics",
    "description": "Laptops, Desktops, Televisions, Office Electronics Products, MP3 Players & Accessories, Batteries, Chargers, Car Electronics, Antennas, Car Electronics Accessories"
  },
  {
    "name": "Books",
    "description": "Computer Science, Biology, Fiction, Non-Fiction, Novels, Reference, Business, Finance"
  },
  {
    "name": "Apparel",
    "description": "Clothes, Shoes, Jewelry"
  },
  {
    "name": "Arts & Crafts",
    "description": "Sewing, Beads, Crafting, Decorations, Fabric, Knitting, Needlework, Printmaking, Gift Wrapping Supplies"
  },
  {
    "name": "Office Products",
    "description": "Pens, Paper, Office Electronics, Wall Safes, Office & School Supplies, Office Furniture & Lighting"
  },
  {
    "name": "Cell Phones & Accessories",
    "description": "Car Mounts, Accessories, Cell Phone Travel Chargers, Smart Phones, Cell Phones"
  },
  {
    "name": "Home & Kitchen",
    "description": "Cookware, Home Decor, Kitchen & Dining, Photo Frames, Bedding, Bath, Furniture, Artwork, Cleaning Supplies"
  },
  {
    "name": "Toys & Games",
    "description": "Board Games, Card Games, Games, Floor Games, Stacking Games"
  },
  {
    "name": "Video Games",
    "description": "Mac, PlayStation 4, Xbox One, Wii, Wii U, PC, Digital Games"
  },
  {
    "name": "Gift Cards",
    "description": "Gift Cards, Prepaid Debit Cards, Game Cards"
  },
  {
    "name": "Automotive",
    "description": "Decals, Cell Phone Car Chargers, Undercoat Paint, Body, Motor Oils, Car Electronics Accessories, Replacement Parts, Tires & Wheels"
  },
  {
    "name": "Beauty",
    "description": "Makeup Brushes, Bath & Body, Fagrances, Makeup, Skin Care, Tools & Accessories"
  },
  {
    "name": "Pet Supplies",
    "description": "Birds, Cats, Dogs, Fish & Aquatic Pets, Horses, Small Animals"
  },
  {
    "name": "Baby",
    "description": "Baby & Toddler Toys, Bathing & Skin Care, Diapering, Feeding, Gear, Gifts, Strollers"
  },
  {
    "name": "Grocery & Food",
    "description": "Snack Foods, Gourmet Gifts, Gourmet Snack Gifts, Canned & Jarred Foods, Potato Chips, Packaged Food"
  },
  {
    "name": "Health & Personal Care",
    "description": "Health Care, Vision Care, Household Supplies, Vitamins, Dietary Supplements"
  },
  {
    "name": "Other",
    "description": "Other categories not listed"
  }];

  // Data to POST posts
  var newPostInfos = [{
    buildPost: function(user) {
      return {
        "user": user,
        "title": "Amazon Echo",
        "description": "An Amazon robot voice thing that will change you life",
        "price": 100,
        "category": "Electronics",
        "location": "On Campus",
        "condition": "Acceptable",
        "obo": "true"
      };
    },
    "userIndex": 0,
    "categoryIndex": 0,
    "locationIndex": 0
  },
  {
    buildPost: function(user) {
      return {
        "user": user,
        "title": "Sony TV 48 Inch",
        "description": "Super new TV pick up in ERC.",
        "price": 400,
        "category": "Electronics",
        "location": "Off Campus",
        "condition": "New",
        "obo": "false"
      };
    },
    "userIndex": 1,
    "categoryIndex": 1,
    "locationIndex": 0
  },
  {
    buildPost: function(user) {
      return {
        "user": user,
        "title": "Everlane Backpack",
        "description": "This backpack is super hipster!",
        "price": 70,
        "category": "Apparel",
        "location": "On Campus",
        "condition": "Used",
        "obo": "true"
      };
    },
    "userIndex": 2,
    "categoryIndex": 2,
    "locationIndex": 0
  },
  {
    buildPost: function(user) {
      return {
        "user": user,
        "title": "Apple iPhone 7 Plus",
        "description": "This phone is too large for my hands.",
        "price": 660,
        "category": "Electronics",
        "location": "On Campus",
        "condition": "Like New",
        "obo": "false"
      };
    },
    "userIndex": 3,
    "categoryIndex": 3,
    "locationIndex": 0
  },
  {
    buildPost: function(user) {
      return {
        "user": user,
        "title": "Cracking the Coding Interview",
        "description": "This book is the bible of CS",
        "price": 30,
        "category": "Books",
        "location": "On Campus",
        "condition": "New",
        "obo": "true"
      };
    },
    "userIndex": 4,
    "categoryIndex": 4,
    "locationIndex": 0
  },
  {
    buildPost: function(user) {
      return {
        "user": user,
        "title": "Ramen Noodles",
        "description": "It's almost finals week!!",
        "price": 30,
        "category": "Food",
        "location": "On Campus",
        "condition": "New",
        "obo": "false"
      };
    },
    "userIndex": 1,
    "categoryIndex": 5,
    "locationIndex": 0
  },
  {
    buildPost: function(user) {
      return {
        "user": user,
        "title": "Wooden Desk",
        "description": "Knock on wood",
        "price": 66,
        "category": "Furniture",
        "location": "Off Campus",
        "condition": "New",
        "obo": "true"
      };
    },
    "userIndex": 6,
    "categoryIndex": 6,
    "locationIndex": 0
  },
  {
    buildPost: function(user) {
      return {
        "user": user,
        "title": "Razer Deathadder",
        "description": "A pretty nice mouse",
        "price": 44,
        "category": "Electronics",
        "location": "On Campus",
        "condition": "Like New",
        "obo": "false"
      };
    },
    "userIndex": 7,
    "categoryIndex": 7,
    "locationIndex": 0
  }];

  // Data to POST offers
  var newOfferInfos = [{
    buildOffer: function(offeredBy, offeredTo) {
      return {
        "offeredBy": offeredBy,
        "offeredTo": offeredTo,
        "price": 10
      };
    },
    "userIndex": 0,
    "postIndex": 0
  }];


  it("Delete users from database", function(done) {
    // Get all users that we want to delete
    request(buildOptions(userUrl, "GET"), function(err, res, body) {
      initialUsers = JSON.parse(body);

      if(initialUsers.length > 0) {
        // Delete the users we retrieved
        for(var idx = 0; idx < initialUsers.length; ++idx) {
          request(buildOptions(userUrl + "/" + initialUsers[idx]._id, "DELETE"), function(err, res, body) {
            // We have finished deleting the last user
            if(idx == initialUsers.length) {
              done();
            }
          }); // End DELETE request
        } // End deleting loop
      }
      // Nothing to delete
      else {
        done();
      }
    }); // End GET request
  });

  // it("Delete locations from database", function(done) {
  //   // Get all locations that we want to delete
  //   request(buildOptions(locationUrl, "GET"), function(err, res, body) {
  //     initialLocations = JSON.parse(body);
  //     if(initialLocations.length > 0) {
  //       // Delete the locations we retrieved
  //       for(var idx = 0; idx < initialLocations.length; ++idx) {
  //         request(buildOptions(locationUrl + "/" + initialLocations[idx]._id, "DELETE"), function(err, res, body) {
  //           // We have finished deleting the last location
  //           if(idx == initialLocations.length) {
  //             done();
  //           }
  //         }); // End DELETE request
  //       } // End deleting loop
  //     }
  //     // Nothing to delete
  //     else {
  //       done();
  //     }
  //   }); // End GET request
  // });

  // it("Delete categories from database", function(done) {
  //   // Get all categories that we want to delete
  //   request(buildOptions(categoryUrl, "GET"), function(err, res, body) {
  //     initialCategories = JSON.parse(body);
  //     if(initialCategories.length > 0) {
  //       // Delete the categories we retrieved
  //       for(var idx = 0; idx < initialCategories.length; ++idx) {
  //         request(buildOptions(categoryUrl + "/" + initialCategories[idx]._id, "DELETE"), function(err, res, body) {
  //           // We have finished deleting the last category
  //           if(idx == initialCategories.length) {
  //             done();
  //           }
  //         }); // End DELETE request
  //       } // End deleting loop
  //     }
  //     // Nothing to delete so we just go straight to inserting categories
  //     else {
  //       done();
  //     }
  //   }); // End GET request
  // });

  it("Delete posts from database", function(done) {
    // Get all posts that we want to delete
    request(buildOptions(postUrl, "GET"), function(err, res, body) {
      initialPosts = JSON.parse(body);

      if(initialPosts.length > 0) {
        // Delete the posts we retrieved
        for(var idx = 0; idx < initialPosts.length; ++idx) {
          request(buildOptions(postUrl + "/" + initialPosts[idx]._id, "DELETE"), function(err, res, body) {
            // We have finished deleting the last post
            if(idx == initialPosts.length) {
              done();
            }
          }); // End DELETE request
        } // End deleting loop
      }
      // Nothing to delete
      else {
        done();
      }
    }); // End GET request
  });

  it("Delete offers from database", function(done) {
    // Get all offers that we want to delete
    request(buildOptions(offerUrl, "GET"), function(err, res, body) {
      initialOffers = JSON.parse(body);

      if(initialOffers.length > 0) {
        // Delete the offers we retrieved
        for(var idx = 0; idx < initialOffers.length; ++idx) {
          request(buildOptions(offerUrl + "/" + initialOffers[idx]._id, "DELETE"), function(err, res, body) {
            // We have finished deleting the last offer
            if(idx == initialOffers.length) {
              done();
            }
          }); // End DELETE request
        } // End deleting loop
      }
      // Nothing to delete
      else {
        done();
      }
    }); // End GET request
  });

  it("Insert users into database", function(done) {
    for(var idx2 = 0; idx2 < newUserInfos.length; ++idx2) {
      request(buildOptions(userUrl, "POST", newUserInfos[idx2]), function(err, res, body) {
        createdUsers.push(JSON.parse(body));

        // We have finished adding the users
        if(idx2 == newUserInfos.length) {
          for(var i = 0; i < 1000000000; ++i) {

          }
          done();
        }
      }); // End POST request
    } // End inserting loop
  });

  // it("Insert categories into database", function(done) {
  //   for(var idx2 = 0; idx2 < newCategoryInfos.length; ++idx2) {
  //     request(buildOptions(categoryUrl, "POST", newCategoryInfos[idx2]), function(err, res, body) {
  //       createdCategories.push(JSON.parse(body));

  //       // We have finished adding the categories
  //       if(idx2 == newCategoryInfos.length) {
  //         done();
  //       }
  //     }); // End POST request
  //   } // End inserting loop
  // });


  // it("Insert locations into database", function(done) {
  //   for(var idx2 = 0; idx2 < newLocationInfos.length; ++idx2) {
  //     request(buildOptions(locationUrl, "POST", newLocationInfos[idx2]), function(err, res, body) {
  //       createdLocations.push(JSON.parse(body));

  //       // We have finished adding the locations
  //       if(idx2 == newLocationInfos.length) {
  //         done();
  //       }
  //     }); // End POST request
  //   } // End inserting loop
  // });

  it("Insert posts into database", function(done) {
    for(var idx2 = 0; idx2 < newPostInfos.length; ++idx2) {
      // Build the new posts
      var post = newPostInfos[idx2];

      var userIdx = post.userIndex;
      // var locationIdx = post.locationIndex;
      // var categoryIdx = post.categoryIndex;

      var newPost = post.buildPost(
        createdUsers[userIdx]._id
      );

      request(buildOptions(postUrl, "POST", newPost), function(err, res, body) {
        createdPosts.push(JSON.parse(body));

        // We have finished adding the posts
        if(idx2 == newPostInfos.length) {
          done();
        }
      }); // End POST request
    } // End inserting loop
  });

  it("Insert offers into database", function(done) {
    for(var idx2 = 0; idx2 < newOfferInfos.length; ++idx2) {
      // Build the new offer
      var offer = newOfferInfos[idx2];

      var userIdx = offer.userIndex;
      var postIdx = offer.postIndex;

      var newOffer = offer.buildOffer(
        createdUsers[userIdx]._id,
        createdPosts[postIdx]._id
      );

      request(buildOptions(offerUrl, "POST", newOffer), function(err, res, body) {
        createdUsers.push(JSON.parse(body));

        // We have finished adding the offers
        if(idx2 == newOfferInfos.length) {
          done();
        }
      }); // End POST request
    } // End inserting loop
  });

});