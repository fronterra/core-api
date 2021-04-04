const express = require('express');

// middleware and model imports
const s3Bucket = require('../../operations/aws/s3Bucket');
const { validateMediaUpload } = require('../middleware/validation');

// env variables
const { AWS_S3_NAME: bucketName, AWS_S3_REGION: region } = require('../../config');

// router
const router = express.Router();

/**
 * `POST /media`
 * 
 * - Calls express-fileupload middleware to parse the request header for content-types of `multipart/formData`
 * - If founds, recieved files are set on the `request.files` property
 * - Custom middleware `validateMediaUpload` is called to validate the file upload and that both `reportId` and `mediaId` were passed in `request.query`.
 * 
 */
router.post('/', validateMediaUpload, async function (request, response, next) {
    try {
        // destructure variables from request body
        const { reportId, mediaId } = request.query;

        // initializes an s3 client instance in the target region according to your baked-in credentials
        const bucketOperations = s3Bucket(region, bucketName); 

        // program media and report ids into an object readable by the bucketOperations.uploadObject function
        const keysObject = {
            itemId: mediaId,
            itemType: 'media',
            groupId: reportId,
            groupType: 'report'
        };

        // destructure request.files object
        const { mediaFile } = request.files;

        // send file to s3 bucket
        const res = await bucketOperations.uploadObject(keysObject, mediaFile.data);

        return response.status(201).json({ res });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;