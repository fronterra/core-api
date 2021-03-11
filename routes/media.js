const express = require('express');
const router = express.Router();
const s3Bucket = require('../services/s3Bucket');
const ExpressError = require('../ExpressError');
const { AWS_S3_NAME: bucketName, AWS_S3_REGION: region } = require('../config');

router.post('/', async function (request, response, next) {
    try {
        // throws error if no file was sent with request
        if (!request.files) throw new ExpressError('No files recieved', 412) // 412 status code === 'Precondition Not Met'

        // throws error if request is missing either its reportId or mediaId
        if (!request.body.reportId || !request.body.mediaId) throw new ExpressError('Request body must contain both of the following properties: mediaId, reportId');

        // destructure variables from request body
        const { reportId, mediaId } = request.body;

        // initializes an s3 client instance in the target region according to your baked-in credentials
        const bucketOperations = s3Bucket(region, bucketName); 

        // program media and report ids into an object readable by the bucketOperations.uploadObject function
        const keysObject = {
            itemId: mediaId,
            itemType: 'media',
            groupId: reportId,
            groupType: 'report'
        };

        // send file to s3 bucket
        const res = await bucketOperations.uploadObject(keysObject, request.files.mediaFile.data);

        return response.status(201).json({ res });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;