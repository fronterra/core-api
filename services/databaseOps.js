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
             * Takes four parameters--`query <Object>`, `projection <Object>`, 
             * `pageNumber <Number>`, `pageSize <Number>`--and returns an array of objects
             * representing one page of results.
             * 
             * *NOTE:* Page indices start at 1.
             * 
             * @param {Object} query a query object as defined in MongoDB Node.js driver docs. It sets
             * the search parameters for what kinds of resources should be returned by a database.
             * 
             * @param {Object} projection a projection object as defined in the MongoDB Node.js driver docs.
             * It sets the output properties of the objects in the return array.
             * 
             * @param {Number} pageNumber sets the maximum number of results to be returned by the array.
             * @param {Number} pageSize determines the number of results to skip before returning a results array.
             */
            async getPage(query, projection, pageNumber, pageSize) {
                try {
                    // input verification logic
                    // should include a step that checks input types and required properties in
                    // query and projection

                    // calculates the number of skips based on page number and size of page
                    const skips = pageSize * (pageNumber - 1)

                    // sorts by ascending timestamp
                    const sort = { timestamp: 1 };

                    // assemble an options object that includes the sort and projection preferences
                    const options = {
                        projection,
                        sort
                    };

                    // stores a cursor containing a page of resource objects
                    const cursor = collection.find(query, options).skip(skips).limit(pageSize);

                    // convert the cursor into an array
                    const reportsArray = await cursor.toArray();

                    // return results
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