process.env.NODE_ENV = "test"; // declare test env

const { TEST_COLLECTION_NAME, DB_NAME, DB_URI } = require('../../config');
const { MongoClient } = require('mongodb');

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

        // defines some mock data including a name and a town
        const people = [
            { firstName: "Alyssa", hometown: "Upland" },
            { firstName: "Abhi", hometown: "Singapore" },
            { firstName: "Noah", hometown: "Columbus" },
            { firstName: "Austin", hometown: "Columbus"},
            { firstName: "Gio", hometown: "Orlando" },
            { firstName: "Claire", hometown: "Columbus" },
            { firstName: "Ceren", hometown: "Istanbul" }
        ];

        // insert the array of mock data
        await collection.insert(people);

    } catch(err) {
        console.log(err);
    } finally {
        // close live connection between client and database
        await client.close();
    }
});

describe('tests for databaseOps().getPage', function() {
    it('should return')
})

afterAll(async () => {
    // handle database tear down
})