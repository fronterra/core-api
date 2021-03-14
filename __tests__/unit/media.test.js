// declare test environment
process.env.NODE_ENV = 'test';

// import test deps
const app = require('../../app');
const supertest = require('supertest');
const { ObjectId } = require('bson');

// builds a mock request object
const request = supertest(app);


describe('POST /media', function() {
    it('should return error message with 412 status code when either mediaId or reportId is missing', async function() {
        // creates fake media id similar to what would typically be passed
        const fakeMediaId = String(new ObjectId()); 

        // mock request without reportId or mediaFile attached should throw error about reportId first.
        const response = await request.post(`/media?mediaId=${fakeMediaId}`);

        // test response message and status
        expect(response.body.message).toStrictEqual('Query string parameters must contain both of the following properties: mediaId, reportId');
        expect(response.body.status).toBe(412);
    });


    it('should return error message with 412 status code when no file is uploaded with the request', async function () {
        // creates fake report and media ids similar to what would typically be passed
        const fakeMediaId = String(new ObjectId()); 
        const fakeReportId = String(new ObjectId());

        // mock request without mediaFile attachment, but with reportId and mediaId, should throw error about missing file
        const response = await request.post(`/media?reportId=${fakeReportId}&mediaId=${fakeMediaId}`);

        // test response message and status
        expect(response.body.message).toStrictEqual('No files recieved');
        expect(response.body.status).toBe(412);
    });
})