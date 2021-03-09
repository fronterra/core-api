const express = require("express");
const morgan = require("morgan");
const ExpressError = require("expressError");

// creates an app object
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logging system
app.use(morgan("tiny"));

app.use(cors());

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