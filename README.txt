Stuffly Server:

Design: 
	- RESTful
		- every part of the URL is a resource
		- every resource follows MVC pattern
			- M = Model
			- V = View (aka Router for us)
			- C = Controller 
		- NoSQL with schemes
			- MongoDB is schemeless by default, but Mongoose API provides schemas for use
			- MongoDB follows CRUD, so we will try to only Create, Read, Update, and/or Delete a resource
			- we can use pure MongoDB or Mongoose functions ... doesn't matter if we don't care about scale/optimization

Flow:
	1. client requests server: api -> router -> controller -> model
	2. server responds client: model -> controller -> router
	- using callbacks, only router's return should reach the client
	- model is sometimes not reached/necessary because Mongoose API provides a lot of high level functions	

Technical terms:
	- api.js : starting point of a request ... defines ports and URL paths
	- collection: equivalent to tables in SQL
	- document: equivalent to entry in SQL
	- schema : equivalent to column in SQL
		- defines the required ivars of a class
			- ex: Car class must have make, model, year, color, etc
		- if schema is defined, encorces a document can be 
	- callback: think of onSuccess/onFail ... LOOK THIS UP !!! THIS IS THE CORE OF NODEJS
	- req : the request
		- req.body : the body content of the request
	- res : the response
		- res.send(200) : sends HTTP code 200 to client

Design Pattern: 
	- Model:
		- defines schemas ... imagine ivars in a class
		- performs, wraps, and exports raw query into "short and pretty" method
			- ex: RAW SQL: SELECT u.lastname FROM user u WHERE u.race = 'Asian'
				  Wrapped method: ArrayList<String> getLastnameByRace (Table user, Race race)
		- exports object is schema + schema methods ... imagine encapulation in a class (ivars, constructor, getter, setter, etc)
		- method types: 
			- static methods: disregard the caller ... caller of static methods has no effect on the return value
				- ex: Car class has a static method 'double convertMpgToKpl(double mg)'
			- instance methods: relies on the caller ... caller of instance method affects or is affected by the function
		- Note: usually the longest file ... direct access to database

	- Router:
		- defines the actions to perform for each end point ... think of API in Java
		- should only uses methods exported from controller to perform actions 
		- aka middleman of the request and backend ... should be easy to understand
		- Note: usually the shortest file ... no logic, only resource and corresponding Controller call

	- Controller:
		- handles complex logics by using model methods or even other models
		- used if i need resources other than my own, like userController needing userModel and carModel
		- Note: usually shorter than Model ... "asks" Model to access database

DNE:
	- DO NOT EVER edit/delete/make the "_id" key in any documents unless you are trying to do "indexing" (MongoDB optimization)
	- DO NOT EVER share/expose your config.json file b/c it contains username/password to MongoLab ... sharing in our private Git is ok
	- DO NOT EVER commit/share/expose your credential file under .elasticbeanstalk ... it has your secret key to our server on AWS
	- DO NOT EVER overflow MongoLab database ... we only have 500MB storage free, should be enough for this class ... contact me ASAP if near limit	
	- DO NOT EVER push to AWS or Git without testing and validating locally
	- DO NOT EVER npm install anything without saving it in package.json ... AWS will break b/c missing package
	
Trivial:
	- In JavaScript: 
		- 'string' and "string" are the same
		- a string without ' or " can still be treated as string ... but don't do this b/c it will bite you back ...
		- JSON variables can be in many forms ... but standard is to ALWAYS surround the key with '' or "" to avoid confusion later on
			- {
				"key0" : "value0",
				"key1" : "value1"
			  }

	- In HTTPS:
		- all sensitive information are stored in req.body b/c SSL can encrypt body of the request
		- Login authentication is kinda complicated ... generally Token based (Facebook) but we can do simple ones
		- JWT is a new feature for more secure HTTP requests ... out of project scope but look it up!!!
		- images can be sent through:
			- form-data: server gets image as is ... but body must be empty
			- encoded string: more secure, but increases size and requires server to decode
			- socket/stream: nope ... too much work
		- PNG is lossless, JPEG is lossy ... so preferrably JPEG 