const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3"); // import aws client sdk
const serializeS3Key = require('./serializeS3Key'); // import key serializer

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
    
    // cache of all responses and errors incurred by instance
    const responseCache = [];

    /**
     * Takes a response object or err and
     * pushes it to the cache
     * @param {Object} res 
     */
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
         * @param {any} file
         * 
         */
        async uploadObject({ itemId, itemType, groupId, groupType }, file) {

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
                    Body: file
                }
            
                // sends file object to s3 bucket and stores response in data variable
                const data = await s3.send(new PutObjectCommand(uploadParams));

                // caches most recent response
                cacheResponse(data);
                return data;
            } catch (err) {
                // caches most recent response
                cacheResponse(err);
                // handle errors
                throw new ExpressError(err.message, err.status || 500);
            }
        },
        async downloadObject(key) {
            try {
                // checks to see if s3 client is instantiated before attempting retrieval
                if (!s3) throw new ExpressError('S3Client instance not found', 500);

                // params object with search targets
                const params = {
                    Bucket: bucketName,
                    Key: key
                };

                // get file from storage
                const data = await s3.send(new GetObjectCommand(params));

                // cache the response
                cacheResponse(data);

                // return data object
                return data;
            } catch (err) {
                // cache error
                cacheResponse(err);

                // handle and throw new error
                throw new ExpressError(err.message, err.status || 500);
            }
        },
        /**
         * Can be called to reset S3Client instance if not valid,
         * should not be able to interrupt already connected client.
         */
        resetS3Client() {
            if (!s3) {
                s3 = new S3Client({ region })
            }
        },
        /**
         * Returns `responseCache` containing all
         * response objects
         */
        getCache () {
            return responseCache;
        }
    }
};

module.exports = s3Bucket;