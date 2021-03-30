const { mongoClientHandler } = require('./connect');
const ExpressError = require('../ExpressError');


/**
 * Returns a collection of database operation functions 
 * for the specified collection.
 * 
 * @param {String} collectionName 
 * 
 */
async function databaseOps(collectionName) {
    try {
        // get helpful utility functions from our mongo client handler
        const { getCollectionInstance, killSwitch, checkClientConnection } = await mongoClientHandler();

        // stores a connection to a specified collection, from which database operations can be made
        const collection = getCollectionInstance(collectionName);

        return {
            /**
             * Returns an array of resources given
             * a specified page index number and size of page.
             * 
             * *NOTE:* Page indices start at 1.
             * 
             * @param {Number} page page number
             * @param {Number} size qty of resources per page
             */
            async getPage(page, size) {
                try {
                    // calculates the number of skips based on page number and size of page
                    const skips = size * (page - 1)

                    // insert an empty query object
                    const query = {};

                    // sorts by ascending timestamp
                    const sort = { timestamp: 1 };

                    // stores a cursor containing a page of resource objects
                    const cursor = collection.find(query).sort(sort).skip(skips).limit(size);

                    // convert the cursor into an array
                    const reportsArray = await cursor.toArray();

                    return reportsArray;
                } catch (err) {
                    throw new ExpressError(err.message, err.status || 500);
                } finally {
                    await killSwitch();
                }
            },
            /**
             * Returns the resource belonging to
             * specified `resourceId`
             * 
             * @param {String} resourceId
             */
            async getResource(resourceId) {
                try {
                    const result = await collection.findOne({ _id: resourceId });
                    return result;
                } catch (err) {
                    throw new ExpressError(err.message, err.status || 500);
                } finally {
                    await killSwitch();
                }
            },
            async search(query) {
                try {
                    const results = collection.find(query);
                    const array = await results.toArray();
                    return array;
                } catch (err) {
                    throw new ExpressError(err.message, err.status || 500);
                }
            },
            async createNewResource() {},
            

        }
    } catch (err) {
        throw new ExpressError(err.message, err.status || 500);
    }
}

module.exports = databaseOps;