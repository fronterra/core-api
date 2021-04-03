const { mongoClientHandler } = require('./connect');
const ExpressError = require('../ExpressError');
const { ObjectId } = require('bson');


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

                    // throw error if query or projection are passed non-object args
                    if (typeof query !== 'object' || typeof projection !== 'object') {
                        throw new ExpressError('query and projection args must both be type Object.', 500);
                    }

                    // throw error if pageNumber or pageSize are passed non-Number args
                    if (typeof pageNumber !== 'number' || typeof pageSize !== 'number') {
                        throw new ExpressError('pageNumber and pageSize args must both be type Number.', 500);
                    }

                    // throw error if pageNumber or pageSize are less than 1
                    if (pageNumber < 1 || pageSize < 1) {
                        throw new ExpressError('indices for pageNumber and pageSize begin at 1; cannot be 0 or negative numbers', 500);
                    }
                    
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
                    const resultsArray = await cursor.toArray();

                    // return results
                    return resultsArray;
                } catch (err) {
                    throw new ExpressError(err.message, err.status || 500);
                } finally {
                    await killSwitch();
                }
            },
            /**
             * Takes an `id <String>` parameter as its only input 
             * and returns the corresponding document (as an <Object>).
             * The function throws an error if no matching document is
             * found, or if the input id is not a string.
             * 
             * @param {String} id
             */
            async getResource(id) {
                try {
                    // throws error if input is not a string
                    if (typeof id !== 'string') throw new ExpressError('Input must be a string', 500);

                    // pass id string to ObjectId constructor to create abstract type understood by MongoDB
                    const _id = new ObjectId(id);

                    // queries database for document with an id match input arg
                    const result = await collection.findOne({ _id });

                    // throw error if no document is returned from query
                    if (!result) throw new ExpressError('No matching documents found', 500);

                    // return result 
                    return result;
                } catch (err) {
                    throw new ExpressError(err.message, err.status || 500);
                } finally {
                    await killSwitch();
                }
            },
            async setManyResources() {},
            async setResource() {},
            /**
             * Takes one parameter, `id <String>`, and deletes the resource 
             * from the database. If no resource is found, or the input type 
             * is incorrect, the function will throw an error. Otherwise, 
             * it returns `true`.
             * 
             * @param {String} id 
             */
            async deleteResource(id) {
                try {
                    // throws error if input is not a string
                    if (typeof id !== 'string') throw new ExpressError('Input must be a string', 500);

                    // pass id string to ObjectId constructor to create abstract type understood by MongoDB
                    const _id = new ObjectId(id);

                    // deletes first document with matching _id property (should only be one by definition)
                    const result = await collection.deleteOne({ _id });

                    // throw error if no document is returned from query
                    if (result.deletedCount === 0) throw new ExpressError('No matching documents found', 500);

                    // return result 
                    return true;
                } catch (err) {
                    throw new ExpressError(err.message, err.status || 500);
                } finally {
                    await killSwitch();
                }
            },
            async updateResource() {}
        }
    } catch (err) {
        throw new ExpressError(err.message, err.status || 500);
    }
}

module.exports = databaseOps;