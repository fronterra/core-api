process.env.NODE_ENV = "test"; // declare test env

const { TEST_COLLECTION_NAME, DB_NAME, DB_URI } = require('../../config');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('bson');
const databaseOps = require('../../services/databaseOps');

// define mock data for tests
const testData = [
            { firstName: "Alyssa", hometown: "Upland" },
            { firstName: "Abhi", hometown: "Singapore" },
            { firstName: "Noah", hometown: "Columbus" },
            { firstName: "Austin", hometown: "Columbus"},
            { firstName: "Gio", hometown: "Orlando" },
            { firstName: "Claire", hometown: "Columbus" },
            { firstName: "Ceren", hometown: "Istanbul" }
];

// for each test data item, create a bson objectId and set into the data object
// this will me it easier for us to test our query functions later on
testData.forEach((v) => {
    v._id = new ObjectId();
});



beforeAll(async () => {
    // create new MongoClient instance
    const client = new MongoClient(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        // initiate live connection between client instance and specified database uri
        await client.connect();

        // get connection with target test database and collection
        const database = client.db(DB_NAME);
        const collection = database.collection(TEST_COLLECTION_NAME);

        // insert the array of mock data
        await collection.insertMany(testData);

    } catch(err) {
        console.log(err);
    } finally {
        // close live connection between client and database
        await client.close();
    }
});

describe('tests for databaseOps().getPage', function() {
    it('should retrieve exactly as many results as are in the collection', async function() {
        try {
            // retrieve getPage function from object returned from databaseOps function closure
            const { getPage } = await databaseOps(TEST_COLLECTION_NAME);        

            // defines parameters
            const query = new Object();
            const projection = new Object;
            const pageSize = testData.length;
            const pageNumber = 1;

            // get results 
            const results = await getPage(query, projection, pageNumber, pageSize);

            // test that the returned array has as many items as the testData array
            expect(results.length).toBe(testData.length);
        } catch(err) {
            console.log(err);
        }
    });

    it('Should get empty array if pageSize * pageNumber extends index range of results', async function() {
        try {
            // retrieve getPage function from object returned from databaseOps function closure
            const { getPage } = await databaseOps(TEST_COLLECTION_NAME);        

            // defines parameters
            const query = new Object;
            const projection = new Object;
            const pageSize = testData.length;
            const pageNumber = 2;

            // get results 
            const results = await getPage(query, projection, pageNumber, pageSize);

            // test that the returned array is empty
            expect(results.length).toBe(0);
        } catch(err) {
            console.log(err);
        }
    });

    it('Throws error if non-object type arg is passed to query or projection parameter', async function() {
        try {
            // retrieve getPage function from object returned from databaseOps function closure
            const { getPage } = await databaseOps(TEST_COLLECTION_NAME);        

            // defines parameters
            const query = new String('This is a string');
            const projection = new Object();
            const pageSize = testData.length;
            const pageNumber = 1;

            // call function, but don't store return value since error is expected
            await getPage(query, projection, pageNumber, pageSize);
        } catch(err) {
            expect(err.message).toStrictEqual('query and projection args must both be type Object.');
        }
    });

    it('Throws error if pageNumber or pageSize are less than 1', async function() {
        try {
            // retrieve getPage function from object returned from databaseOps function closure
            const { getPage } = await databaseOps(TEST_COLLECTION_NAME);        

            // defines parameters
            const query = new Object();
            const projection = new Object();
            const pageSize = testData.length;
            const pageNumber = 0;

            await getPage(query, projection, pageNumber, pageSize);
        } catch(err) {
            expect(err.message).toStrictEqual('indices for pageNumber and pageSize begin at 1; cannot be 0 or negative numbers');
        }
    });
});

describe('tests for databaseOps().getResource', function() {
    // test normal behavior
    it('should get the correct item from database when given valid id string', async function() {
        try {
            // get function to test
            const { getResource } = await databaseOps(TEST_COLLECTION_NAME);

            // get first item in test data array
            const testDataFirstItem = testData[0]

            const _id = String(testDataFirstItem._id)

            // get document from database
            const document = await getResource(_id);

            // test that the retreived item matches the mock data item inserted earlier:
            // check against firstName prop
            expect(document.firstName).toStrictEqual(testDataFirstItem.firstName);

            // check against hometown prop
            expect(document.hometown).toStrictEqual(testDataFirstItem.hometown);

        } catch (err) {
            console.log(err);
        }
    });


    // test that error is thrown when incorrect paramter type is passed
    it('should throw an error when incorrect parameter type is passed', async function() {
        let error = false;
        let document = false;
        try {
            // get function to test
            const { getResource } = await databaseOps(TEST_COLLECTION_NAME);

            // incorrect input type
            const numberInput = 5;

            // get document from database
            document = await getResource(numberInput);
        } catch (err) {
            error = err;
        } finally {
            expect(error.message).toStrictEqual('Input must be a string', 500);
            expect(document).toBe(false); // document should still be false if error was thrown
        }
    });


    // test the error is thrown when paramter type is correct, but no match is found in the database
    it('should throw an error when input id does not match any documents in the database', async function() {
        let error = false;
        let document = false;
        try {
            // get function to test
            const { getResource } = await databaseOps(TEST_COLLECTION_NAME);

            // create fake id string
            const fakeId = String(new ObjectId());

            // execute function
            document = await getResource(fakeId);

        } catch(err) {
            error = err;
        } finally {
            // test results
            expect(error.message).toStrictEqual('No matching documents found');
            expect(document).toBe(false);
        }
    });
});

describe('tests for databaseOps().deleteResource', function () {
    // test normal behavior
    it('should delete the correct item from database when given valid id string', async function() {
        let error = false;
        let queryResult = false;
        try {
            // get deleteResource to test that function behaves correctly,
            // and also retrieve getResource for a follow up test
            // to check that the document has actually been deleted from
            // the database
            const { deleteResource } = await databaseOps(TEST_COLLECTION_NAME);
            const { getResource } = await databaseOps(TEST_COLLECTION_NAME);

            // get first item in test data array
            const testDataFirstItem = testData[0]

            const _id = String(testDataFirstItem._id)

            // delete document from database
            const result = await deleteResource(_id);

            // test that result is true
            expect(result).toBe(true);

            // attempt retrieval of deleted item
            queryResult = await getResource(_id);

        } catch (err) {
            error = err;
        } finally {
            // mini integration-test with getResource results
            expect(queryResult).toBe(false);
            expect(error.message).toStrictEqual('No matching documents found');
        }
    });

    // test that error is thrown when passed incorrect input type
    it('should throw an error when incorrect parameter type is passed', async function() {
        let error = false;
        let document = false;
        try {
            // get function to test
            const { deleteResource } = await databaseOps(TEST_COLLECTION_NAME);

            // incorrect input type
            const numberInput = 5;

            // delete document from database (will fail)
            document = await deleteResource(numberInput);
        } catch (err) {
            error = err;
        } finally {
            expect(error.message).toStrictEqual('Input must be a string', 500);
            expect(document).toBe(false); // document should still be false if error was thrown
        }
    });

    // test that error is thrown when valid id is passed, but no matching document is found for deletion
    it('should throw an error when input id does not match any documents in the database', async function() {
        let error = false;
        let document = false;
        try {
            // get function to test
            const { deleteResource } = await databaseOps(TEST_COLLECTION_NAME);

            // create fake id string
            const fakeId = String(new ObjectId());

            // execute function
            document = await deleteResource(fakeId);

        } catch(err) {
            error = err;
        } finally {
            // test results
            expect(error.message).toStrictEqual('No matching documents found');
            expect(document).toBe(false);
        }
    });
});

describe('tests for databaseOps().updateResource', function() {
    // test normal behavior
    it('should correctly update the target document', async function() {
        let result = false;
        let error = false;
        try {
            // get function to test
            const { updateResource } = await databaseOps(TEST_COLLECTION_NAME);

            // define a valid updates array
            const updates = [
                { field: 'firstName', value: 'Austino' },
                { field: 'hometown', value: 'New York City' }
            ];

            // get id of test data item where firstName property is `Austin`
            let targetId;

            testData.forEach(v => {
                if (v.firstName === 'Austin') {
                    targetId = v._id;
                }
            });

            // construct id string from ObjectId type
            const _id = String(targetId);

            // execute update function
            result = await updateResource(_id, updates);
        } catch (err) {
            error = err; // this should not execute
        } finally {
            // test against stored result values
            expect(result).toBe(1); // indicates that two successful changes were made
            expect(error).toBe(false); // should be false if no error is thrown
        }
    });

    // test that error is thrown when incorrect input type is passed
    it('should throw an error when the first parameter is not a string', async function() {
        let error = false;
        let document = false;
        try {
            // get function to test
            const { updateResource } = await databaseOps(TEST_COLLECTION_NAME);

            // input type
            const _id = 5;

            // create updates object
            const updates = [
                { field: 'firstName', value: 'Alyssino' }
            ];

            // delete document from database (will fail)
            document = await updateResource(_id, updates);
        } catch (err) {
            error = err;
        } finally {
            expect(error.message).toStrictEqual('First parameter must be a string', 500);
            expect(document).toBe(false); // document should still be false if error was thrown
        }
    });

    // test that error is thrown when no document is found matching the id input
    it('should thrown an error when no document is found matching the id input', async function() {
        let error = false;
        let document = false;
        try {
            // get function to test
            const { updateResource } = await databaseOps(TEST_COLLECTION_NAME);

            // create and serialize fake id
            const fakeId = String(new ObjectId());

            const updates = [
                { field: 'firstName', value: 'Alyssino' }
            ]

            // execute function
            document = await updateResource(fakeId, updates);
        } catch (err) {
            error = err;
        } finally {
            expect(error.message).toStrictEqual('No matching documents found');
            expect(document).toBe(false)
        }
    });

    // test that an error is thrown if any items in the update array are wrong, but id is correct and finds a match
    it('should throw an error if any items in the update array are wrong, but id is correct and finds a match', async function() {
        let error = false;
        let document = false;
        try {
            // get function to test
            const { updateResource } = await databaseOps(TEST_COLLECTION_NAME);

            // create and serialize target id
            const _id = String(testData[0]._id);

            // create an updates object with incorrect fields
            const updates = [
                { notField: 'firstName', value: 'Alyssino' }
            ];

            // execute function
            document = await updateResource(_id, updates);
        } catch (err) {
            error = err;
        } finally {
            expect(error.message).toStrictEqual('All items in updates array must contain both of the following properties: field, value');
            expect(document).toBe(false)
        }
    });
});

describe('tests for databaseOps().setResources', function () {
    // test normal behavior
    it('should insert documents and return the number of inserted documents', async function () {
        let result = false;
        let error = false;
        try {
            // get function to be tested
            const { setResources } = await databaseOps(TEST_COLLECTION_NAME);

            // create fake documents
            const documents = [
                { firstName: "Ryan", hometown: "Wadsworth" },
                { firstName: "Zach", hometown: "Pasadena" }
            ];

            // insert documents into database
            result = await setResources(documents);
        } catch (err) {
            error = err; // this block should never execute
        } finally {
            expect(result).toBe(2); // result should be changed from false to the number of successfully inserted resources
            expect(error).toBe(false); // error block should never execute
        }
    });

    // test that an error is thrown when input is not an array
    it('should test that an error is thrown when input is not an array',  async function () {
        let result = false;
        let error = false;
        try {
            // get function to be tested
            const { setResources } = await databaseOps(TEST_COLLECTION_NAME);

            // execute function with non-array type passed in
            result = await setResources(2);
        } catch (err) {
            error = err; // this block SHOULD fire
        } finally {
            expect(result).toBe(false);
            expect(error.message).toStrictEqual('Input must be an array');
        }
    });


    // test that an error is thrown when the input is an empty array
    it('should throw an error if input array is empty', async function () {
        let result = false;
        let error = false;
        try {
            // get function to test
            const { setResources } = await databaseOps(TEST_COLLECTION_NAME);

            // execute function with empty array
            result = await setResources([]);
        } catch (err) {
            error = err;
        } finally {
            expect(result).toBe(false);
            expect(error.message).toStrictEqual('Input array cannot be empty');
        }
    });
});

afterAll(async () => {
    // create new MongoClient instance
    const client = new MongoClient(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        // initiate live connection between client instance and specified database uri
        await client.connect();

        // get connection with target test database and collection
        const database = client.db(DB_NAME);
        const collection = database.collection(TEST_COLLECTION_NAME);

        // delete all documents in the database
        await collection.deleteMany({}); // this MUST have an await statement before, or client will attempt closure during deletion
        
    } catch (err) {
        console.log(err);
    } finally {
        // close live connection with database
        await client.close();
    }
});