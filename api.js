/*
 * Author: Ryan Liao
 */

var express = require('express');
var app     = express();
var bodyParser  = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


var nconf = require('nconf');
nconf.argv().env().file({ file: './config.json' });

var mongoose = require('mongoose');
mongoose.connect( nconf.get('database') );

var userRouter = require(__dirname + '/user/userRouter');
var postRouter = require(__dirname + '/post/postRouter');
app.use('/api/user', userRouter);
//app.use('/api/post', postRouter);

var port = process.env.PORT || 8000;
app.listen(port);

console.log("$Server started on port: " + port);
