const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

/**
 * Creates an S3Client instance and returns an
 * object containing functions for operating on
 * the target bucket.
 * 
 * @example
 * ```js
 * // get region and bucket values from env vars
 * const region = process.env.BUCKET_REGION;
 * const bucket = process.env.BUCKET_NAME;
 * 
 * // import s3Bucket module
 * const s3Bucket = require('../s3Bucket');
 * 
 * // creates instance of s3 and returns object containing funcs
 * // to operate on bucket
 * const s3Ops = s3Bucket(region, bucket);
 * 
 * // you can now call functions/methods related to the bucket instance
 * const response = uploadObject(objKey, objBody);
 * ```
 */
function s3Bucket(region, bucketName) {
    // create an instance of s3 client in a specified region
    let s3 = new S3Client({ region });

    // stores target bucket name
    let bucketName = bucketName;

    return {
        async uploadObject(key, body) {
            
            // creates an uploadParams object based on inputs
            const uploadParams = {
                Bucket: bucketName,
                // Specify the name of the new object. For example, 'index.html'.
                // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
                Key: key,
                // Content of the new object.
                Body: body
            }

            try {
                const data = await s3.send(new PutObjectCommand(uploadParams));
                return data;
            } catch (err) {

            }
            
        },
        downloadObject() {}
    }
};

module.exports = s3Bucket;