const express = require('express');

// router
const router = express.Router();

router.post('/', async function(request, response, next) {
    try {
        // get values from request body
        const { description, location, locationType, datetime, datetimeType, pollutionType, mediaIds, mediaUploadSuccesses, mediaUploadFailures } = request.body;

        // send information

        // return 201
        return response.status(201);

    } catch(err) {
        return next(err);
    }
});

router.get('/', async function(request, response, next) {
    try {

    } catch (err) {
        return next(err);
    }
});
