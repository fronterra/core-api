const express = require('express');
const router = express.Router();
const s3Bucket = require('../services/s3Bucket');
const ExpressError = require('../ExpressError');

router.post('/', async function (request, response, next) {
    try {
        if (!request.files) {
            throw new ExpressError('No files recieved', 412) // 412 status code === 'Precondition Not Met'
        }

        
    } catch (err) {
        return next(err);
    }
});


