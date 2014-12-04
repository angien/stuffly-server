// /*
//  * Test the relationship between posts and users/locations/categories.
//  * i.e. creating a post should populate the 'posts' array of the referenced
//  * user, location, and category models
//  */

// var request = require('request');
// var userUrl = 'http://localhost:8000/api/user';
// var postUrl = 'http://localhost:8000/api/post';
// var categoryUrl = 'http://localhost:8000/api/category';
// var locationUrl = 'http://localhost:8000/api/location';

// // Return json of options for http requests
// var buildOptions = function(url, method, form) {
//   return {
//     'url': url,
//     'method': method,
//     'form': form
//   };
// };

// describe("Post: POST and GET requests cascading updates on other models", function() {
//   // Create the user
//   var createdUser;

//   // Data to POST a user
//   var newUserInfo = {
//     'firstname': 'Angie',
//     'lastname': 'Nguyen',
//     'email': 'angienguyen@gmail.com'
//   };

//   // Set up by inserting user into db
//   beforeEach(function(done) {
//     request(buildOptions(userUrl, 'POST', newUserInfo), function(err, res, body) {
//       createdUser = JSON.parse(body);

//       done();
//     });
//   });

//   // Tear down by removing user from db
//   afterEach(function(done) {
//     request(buildOptions(userUrl + '/' + createdUser._id, 'DELETE'), function(err, res, body) {
//       expect(err).toBe(null);

//       // Reset variables
//       createdUser = {};

//       done();
//     });
//   });

//   // Create the category
//   var createdCategory;

//   // Data to POST a category
//   var newCategoryInfo = {
//     "name": "Books",
//     "description": "Books and things."
//   };

//   // Set up by inserting category into db
//   beforeEach(function(done) {
//     request(buildOptions(categoryUrl, 'POST', newCategoryInfo), function(err, res, body) {
//       createdCategory = JSON.parse(body);

//       done();
//     });
//   });

//   // Tear down by removing category from db
//   afterEach(function(done) {
//     request(buildOptions(categoryUrl + '/' + createdCategory._id, 'DELETE'), function(err, res, body) {
//       expect(err).toBe(null);

//       // Reset variables
//       createdCategory = {};

//       done();
//     });
//   });

//   // Create the location
//   var createdLocation;

//   // Data to POST a location
//   var newLocationInfo = {
//     "name": "Geisel Library",
//     "description": "UC San Diego's library on Library Walk",
//     "address": {
//       "street": "9500 Gilman Dr",
//       "city": "La Jolla",
//       "state": "CA",
//       "zip": "92093"
//     }
//   };

//   // Set up by inserting location into db
//   beforeEach(function(done) {
//     request(buildOptions(locationUrl, 'POST', newLocationInfo), function(err, res, body) {
//       createdLocation = JSON.parse(body);

//       done();
//     });
//   });

//   // Tear down by removing location from db
//   afterEach(function(done) {
//     request(buildOptions(locationUrl + '/' + createdLocation._id, 'DELETE'), function(err, res, body) {
//       expect(err).toBe(null);

//       // Reset variables
//       createdLocation = {};

//       done();
//     });
//   });

//   // Create the post
//   var createdPost;

//   // Data to pass into requests for posts
//   var buildNewPostInfo = function(userid, categories, location) {
//     return {
//       "user": userid,
//       "title": "Cracking the Coding Interview",
//       "description": "The Bible for CS Majors",
//       "price": 31,
//       "categories": categories,
//       "location": location,
//       "condition": "New"
//     };
//   };

//   var buildUpdatedPostInfo = function(userid, categories, location) {
//     return {
//       "user": userid,
//       "title": "Programming Interviews Exposed",
//       "description": "Another Bible for CS Majors if you want a job",
//       "price": 15,
//       "categories": categories,
//       "location": location,
//       "condition": "New"
//     };
//   };

//   // Set up by inserting posts into db
//   beforeEach(function(done) {
//     var newPostInfo = buildNewPostInfo(createdUser._id, [createdCategory._id], createdLocation._id);

//     request(buildOptions(postUrl, 'POST', newPostInfo), function(err, res, body) {
//       createdPost = JSON.parse(body);

//       done();
//     });
//   });

//   // Tear down by removing posts from db
//   afterEach(function(done) {
//     request(buildOptions(postUrl + '/' + createdPost._id, 'DELETE'), function(err, res, body) {
//       expect(err).toBe(null);

//       // Reset variables
//       createdPost = {};

//       done();
//     });
//   });

//   ////////////////////////////////
//   //ALL THE TEST CASES FOR POSTS//
//   ////////////////////////////////

//   /*
//     After creating a new post, check if user, category, and location models have
//     correctly pushed to their 'posts' arrays
//    */

//   it("should result in populated posts arrays in user, category, location", function(done) {
//     // Get post's user
//     request(buildOptions(userUrl + '/' + createdPost.user, 'GET'), function(err, res, body) {
//       var userDoc = JSON.parse(body);
//       var userPosts = userDoc.posts;

//       var isPostInUserPosts = false;

//       // For each post in user, check if the newly created post is in the array
//       for(var idx = 0; idx < userPosts.length; ++idx) {
//         if(userPosts[idx]._id === createdPost._id) {
//           isPostInUserPosts = true;
//           break;
//         }
//       }

//       expect(isPostInUserPosts).toEqual(true);

//       // Get post's location to check it's posts array for this post id
//       request(buildOptions(locationUrl + '/' + createdPost.location, 'GET'), function(err, res, body) {
//         var locationDoc = JSON.parse(body);
//         var locationPosts = locationDoc.posts;

//         var isPostInLocationPosts = false;

//         // Check each post in location
//         for(var idx = 0; idx < locationPosts.length; ++idx) {
//           if(locationPosts[idx]._id === createdPost._id) {
//             isPostInLocationPosts = true;
//             break;
//           }
//         }

//         expect(isPostInLocationPosts).toEqual(true);

//         // Get post's location to check it's posts array for this post id
//         var postCategories = createdPost.categories;

//         // Go through each category of this post
//         for(var idx = 0; idx < postCategories.length; ++idx) {
//           request(buildOptions(categoryUrl + '/' + postCategories[idx], 'GET'), function(err, res, body) {
//             var categoryDoc = JSON.parse(body);
//             var categoryPosts = categoryDoc.posts;

//             var isPostInCategoryPosts = false;

//             // For each category's posts array, check if it contains the created post's id
//             for(var idx = 0; idx < categoryPosts.length; ++idx) {
//               if(categoryPosts[idx]._id === createdPost._id) {
//                 isPostInCategoryPosts = true;
//                 break;
//               }
//             }

//             expect(isPostInCategoryPosts).toEqual(true);

//             // Return from this async function on the last loop iteration
//             if(idx + 1 == postCategories.length) {
//               done();
//             }
//           });
//         }
//       });

//     });
//   });

//   /*
//     After updating a post's references, check if user, category, and location models have
//     correctly modified their 'posts' arrays
//    */

//   it("should result in populated and modified posts arrays if we PUT a post", function(done) {
//     // Create another user, category, and location with a purpose of updating the current post
//     var anotherUser;
//     var anotherCategory;
//     var anotherLocation;
//     var updatedPostInfo;
//     var updatedPost;

//     // Create new user
//     request(buildOptions(userUrl, 'POST', newUserInfo), function(err, res, body) {
//       anotherUser = JSON.parse(body);

//       // Create new category
//       request(buildOptions(categoryUrl, 'POST', newCategoryInfo), function(err, res, body) {
//         anotherCategory = JSON.parse(body);

//         // Create new location
//         request(buildOptions(locationUrl, 'POST', newLocationInfo), function(err, res, body) {
//           anotherLocation = JSON.parse(body);

//           // Make sure everything is created before we update our post
//           expect(anotherUser != null && anotherCategory != null && anotherLocation != null).toEqual(true);
//           updatedPostInfo = buildUpdatedPostInfo(anotherUser._id, [anotherCategory._id], anotherLocation._id);

//           // Update the post with our new info
//           request(buildOptions(postUrl + '/' + createdPost._id, 'PUT', updatedPostInfo), function(err, res, body) {
//             updatedPost = JSON.parse(body);

//             // Now check the 'posts' arrays in updated user
//             request(buildOptions(userUrl + '/' + updatedPost.user, 'GET'), function(err, res, body) {
//               anotherUser = JSON.parse(body);
//               var anotherUserPosts = anotherUser.posts;
//               var isPostInUserPosts = false;

//               for(var idx = 0; idx < anotherUserPosts.length; ++idx) {
//                 if(anotherUserPosts[idx]._id === updatedPost._id) {
//                   isPostInUserPosts = true;
//                   break;
//                 }
//               }

//               expect(isPostInUserPosts).toEqual(true);

//               // Now check the 'posts' array in updated location
//               request(buildOptions(locationUrl + '/' + updatedPost.location, 'GET'), function(err, res, body) {
//                 anotherLocation = JSON.parse(body);
//                 var anotherLocationPosts = anotherLocation.posts;
//                 var isPostInLocationPosts = false;

//                 for(var idx = 0; idx < anotherLocationPosts.length; ++idx) {
//                   if(anotherLocationPosts[idx]._id === updatedPost._id) {
//                     isPostInLocationPosts = true;
//                     break;
//                   }
//                 }

//                 expect(isPostInLocationPosts).toEqual(true);

//                 // Now check the 'posts' array for each updated category
//                 var updatedCategories = updatedPost.categories;
//                 for(var idx = 0; idx < updatedCategories.length; ++idx) {
//                   request(buildOptions(categoryUrl + '/' + updatedCategories[idx], 'GET'), function(err, res, body) {
//                     var categoryDoc = JSON.parse(body);
//                     var categoryPosts = categoryDoc.posts;

//                     var isPostInCategoryPosts = false;

//                     // For each category's posts array, check if it contains the updated post's id
//                     for(var idx = 0; idx < categoryPosts.length; ++idx) {
//                       if(categoryPosts[idx]._id === updatedPost._id) {
//                         isPostInCategoryPosts = true;
//                         break;
//                       }
//                     }

//                     expect(isPostInCategoryPosts).toEqual(true);

//                     // Return from this async function on the last loop iteration
//                     if(idx + 1 == updatedCategories.length) {
//                       done();
//                     }

//                   });
//                 }
//               });
//             });
//           });
//         });
//       });
//     });
//   });

// });