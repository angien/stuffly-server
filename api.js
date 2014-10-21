var express = require('express');
var app     = express();
var bodyParser  = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


var nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var mongoose   = require('mongoose');
//mongoose.connect( nconf.get('database') );

var port = process.env.PORT || 8000;
var userRoute = require(__dirname + '/user');

app.use('/api/user', userRoute);

app.listen(port);

//