/*
 * Author: Ryan Liao, Michael Luo
 */
"use strict";
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
// var locationRouter = require(__dirname + '/location/locationRouter');
// var categoryRouter = require(__dirname + '/category/categoryRouter');
var offerRouter = require(__dirname + '/offer/offerRouter');
var messageRouter = require(__dirname + '/message/messageRouter');

app.use(express.static(__dirname + '/public'));
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
// app.use('/api/location', locationRouter);
// app.use('/api/category', categoryRouter);
app.use('/api/offer', offerRouter);
app.use('/api/message', messageRouter);

var port = process.env.PORT || 8000;
app.listen(port);

console.log("$Server started on port: " + port);
