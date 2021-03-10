const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3"); // import aws client sdk
const serializeS3Key = require('./serializeS3Key'); // import key serializer
const fs = require('fs');
const path = require('path');

/**
 * Creates an `S3Client` instance and returns an
 * object containing functions for operating on
 * the target bucket specified by input args `region`
 * and `bucketName`.
 * 
 * @param {String} region
 * @param {String} bucketName
 * @param {String} groupId serialized BSON.ObjectId value corresponding to group with which the object should be associated
 * 
 * @example
 * ```js
 * // get region and bucket values from env vars
 * const region = process.env.BUCKET_REGION;
 * const bucket = process.env.BUCKET_NAME;
 * 
 * // import s3Bucket module
 * const s3Bucket = require('./s3Bucket');
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
    // initialize s3 instance variable
    let s3;

    try {
        // creates an instance of s3 client in a specified region        
        s3 = new S3Client({ region });
    } catch (err) {
        throw new ExpressError(err.message, err.status || 500);
    }
    
    

    const responseCache = [];

    const cacheResponse = (res) => responseCache.push(res);


    return {
        /**
         * Takes a `keysObject` object containing various key types and ids, in addition to
         * a `body` argument containing the file to be uploaded. The function serializes the
         * contents of `keysObject` into a string, and then passes the new key string along
         * with the `body` file to an S3 bucket for storage.
         * 
         * The function returns the response body from AWS. An example response body is available
         * below.
         * 
         * @param {String} keysObject
         * 
         * @param {String} keysObject.itemId
         * @param {String} keysObject.itemType
         * @param {String} keysObject.groupId
         * @param {String} keysObject.groupType
         * 
         * @param {any} body
         * 
         */
        async uploadObject({ itemId, itemType, groupId, groupType }, body) {

            try {
                // this will throw an error if inputs are not correctly typed
                const serializedKey = serializeS3Key(itemType, itemId, groupType, groupId);
                
                // creates an uploadParams object based on inputs
                const uploadParams = {
                    Bucket: bucketName,

                    // Specify the name of the new object. For example, 'index.html'.
                    // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
                    Key: serializedKey,

                    // Content of the new object.
                    Body: body
                }
            
                const data = await s3.send(new PutObjectCommand(uploadParams));
                cacheResponse(data);
                return data;
            } catch (err) {
                cacheResponse(err);
                // handle errors
                throw new ExpressError(err.message, err.status || 500);
            }
        },
        getCache () {
            return responseCache;
        }
    }
};

const getFile = (fp) => {
    const filePath = path.join(__dirname, fp);
    return fs.readFile(filePath); 
}
b.uploadObject({ groupType: 'reports', groupId: '1234', itemType: 'media', itemId: '4322'}, require('path').basename('./package.json'))
module.exports = s3Bucket;