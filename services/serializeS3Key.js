const ExpressError = require('../ExpressError');

const checkInputs = (type, inputs) => {
    for (let input of inputs) {
        if (typeof input !== type) return false;
    }
    return true;
}

/**
 * Takes four strings as arguments and returns a concatination
 * of all into one path
 * 
 * @param {String} itemType 
 * @param {String} itemId 
 * @param {String} groupType 
 * @param {String} groupId 
 * 
 * @returns {String}
 * 
 * @example
 * ```js
 * > const serialized = serializeS3Key('report', '1234', 'media', '4321')
 * > console.log(serialized);
 * 'report/1234/media/4321'
 * ```
 */
const serializeS3Key = (itemType, itemId, groupType, groupId) => {
    // throws error if inputs are of incorrect type
    if (!checkInputs('string', [itemType, itemId, groupType, groupId])) throw new ExpressError('All arguments must be strings', 400);

    // return serialized key
    return `${groupType}/${groupId}/${itemType}/${itemId}`;
}



module.exports = serializeS3Key;