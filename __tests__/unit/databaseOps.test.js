process.env.NODE_ENV = "test"; // declare test env

const { TEST_COLLECTION_NAME, DB_NAME, DB_URI } = require('../../config');
const { MongoClient } = require('mongodb');
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
        await collection.insert(testData);

    } catch(err) {
        console.log(err);
    } finally {
        // close live connection between client and database
        await client.close();
    }
});

describe('tests for databaseOps().getPage', async function() {
    // retrieve getPage function from object returned from databaseOps function closure
    const { getPage } = await databaseOps(TEST_COLLECTION_NAME);

    it('should successfully get a page of results', async function() {
        const query = {};
        const projection = {};
        const pageSize = 
    });
})

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
        collection.deleteMany({});
        
    } catch (err) {
        console.log(err);
    } finally {
        // close live connection with database
        await client.close();
    }
})