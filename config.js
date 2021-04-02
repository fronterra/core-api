require('dotenv').config();

module.exports = function () {
    const NODE_ENV = process.env.NODE_ENV;
    const AWS_S3_REGION = (NODE_ENV === 'test') ? process.env.TEST_AWS_S3_REGION : process.env.AWS_S3_REGION;
    const AWS_S3_NAME = (NODE_ENV === 'test') ? process.env.TEST_AWS_S3_NAME : process.env.AWS_S3_NAME;

    const DB_URI = (NODE_ENV === 'test') ? process.env.TEST_DB_URI : process.env.DB_URI;
    const DB_NAME = (NODE_ENV === 'test') ? process.env.TEST_DB_NAME : process.env.DB_NAME;
    const TEST_COLLECTION_NAME = process.env.TEST_COLLECTION_NAME;

    return {
        PORT: process.env.PORT || 4000,
        AWS_S3_REGION,
        AWS_S3_NAME,
        DB_URI,
        DB_NAME,
        TEST_COLLECTION_NAME
    }
}();