// declare test environment
process.env.NODE_ENV = 'test';

// import test deps
const app = require('../../app');
const supertest = require('supertest');
const { ObjectId } = require('bson');

// builds a mock request object
const request = supertest(app);


describe('POST /media', function() {
    it('should return error message with 412 status code when no file is uploaded with the request', async function() {
        // creates fake media id similar to what would typically be passed
        const fakeMediaId = String(new ObjectId()); 

        // mock request
        const response = await request.post('/media').send({ reportId: undefined, mediaId: fakeMediaId });

        // test response message and status
        expect(response.body.message).toStrictEqual('Request body must contain both of the following properties: mediaId, reportId');
        expect(response.body.status).toBe(412);
    });


    it('should return error message with 412 status code and message about file requirement', async function () {
        // creates fake report and media ids similar to what would typically be passed
        const fakeMediaId = String(new ObjectId()); 
        const fakeReportId = String(new ObjectId());

        // mock request
        const response = await request.post('/media').send({ reportId: fakeReportId , mediaId: fakeMediaId });

        // test response message and status
        expect(response.body.message).toStrictEqual('No files recieved');
        expect(response.body.status).toBe(412);
    });
})