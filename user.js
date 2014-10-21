var express = require('express');
var device = express.Router();

device.route('/')
   /*
    *   Request when APP is open
    */
    .get( function( req, res )
    {
        console.log(device);
        res.json(
            {
                user : "ryan"
            });

    });

module.exports = device