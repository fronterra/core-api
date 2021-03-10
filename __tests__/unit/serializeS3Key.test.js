const serializeS3Key = require('../../services/serializeS3Key');
const { ObjectID } = require('bson');


describe('Builds serialized s3 key string from string inputs', function() {
    it('correctly builds string from expected types', function() {
        const groupType = 'report'
        const groupId = String(new ObjectID());
        const itemType = 'media';
        const itemId = String(new ObjectID());

        const serialized = serializeS3Key(itemType, itemId, groupType, groupId);
        expect(typeof serialized).toBe('string');
    });

    it('fails if inputs are not strings', function() {
        let error;
        let serialized = null;
        try {
            serialized = serializeS3Key(1, 2, 3, 'four');
        } catch(err) {
            error = err;
        }
        expect(serialized).toBe(null);
        expect(error.message).toStrictEqual('All arguments must be strings');
    })
});