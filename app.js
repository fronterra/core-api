const express = require("express");
const bodyParser = require('body-parser');
const morgan = require("morgan");
const cors = require('cors');
const fileUpload = require('express-fileupload');
const ExpressError = require("./ExpressError");
const media = require('./routes/media');


// creates an app object
const app = express();


// enables file uploads
app.use(fileUpload({
  createParentPath: true
}));

// additional middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("tiny"));


// routes
app.use('/media', media);



/** 404 handler */
app.use(function(request, response, next) {
    const err = new ExpressError("Not Found", 404);
    // pass the error to the next piece of middleware
    return next(err);
});




/** general error handler */
app.use(function(err, request, response, next) {
    response.status(err.status || 500);
  
    // only log stack errors in a dev or production env
    process.env.NODE_ENV !== 'test' ?? console.error(err.stack);
  
    return response.json({
      status: err.status,
      message: err.message
    });
});
  
  module.exports = app;