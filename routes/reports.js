const express = require('express');
const Report = require('../models/Report');

// router
const router = express.Router();

router.post('/', async function(request, response, next) {
    try {
        // get values from request body
        const { 
            description, 
            location, 
            locationType, 
            datetime, 
            datetimeType, 
            pollutionType, 
            mediaIds, 
            mediaUploadSuccesses, 
            mediaUploadFailures 
        } = request.body;

        // send information
        const result = await Report.create(); // FINISH CODE

        // return 201
        return response.status(201);

    } catch(err) {
        return next(err);
    }
});

router.get('/', async function(request, response, next) {
    try {
        // Look for page and size in query string params (should have been validated/ stocked with defaults by middleware)
        const { page, size } = request.query;

        // sets the type of read operation
        const operation = 'fullPage';

        // sets the page and size values into
        const args = { page, size };

        // gets a full page of results from the server
        const results = await Report.read(operation, args);

        // return the array of report objects
        return response.status(200).json(results)
    } catch (err) {
        return next(err);
    }
});


router.get('/:reportId', async function(request, response, next) {
    try {
        // gets the target report from the url params
        const { reportId } = request.params;

        // sets the read operation type
        const operation = 'singleReport';

        // sets the args object
        const args = { reportId };

        // looks from result from the sever
        const report = await Report.read(operation, args);

        // returns the report
        return response.status(200).json(report);
    } catch (err) {
        return next(err);
    }
});

router.get('/search', async function(request, response, next) {
    try {
        // get search query from the string params
        const { query } = request.query;

        // sets operation type
        const operation = 'search';

        // sets args
        const args = { query };

        // retrieves search results from server
        const results = await Report.read(operation, args);

        // return the search results
        return response.status(200).json(results);
    } catch (err) {
        return next(err);
    }
});
