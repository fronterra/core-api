const ExpressError = require('../ExpressError');

/**
 * Checks that the `args` object contains
 * properties corresponding to the correct
 * operation type. If a match occurs, the 
 * function returns true, otherwise an error 
 * is thrown
 * 
 * @param {String} operation 
 * @param {Object} args 
 */
function argsMatchOp(operation, args) {
    switch (operation) {
        // the search operation type must contain
        case 'search':
            if (args.query !== undefined && typeof args.query === 'string') {
                return true
            } else {
                throw new ExpressError('args must contain a `query` key corresponding to a string value ', 500);
            }
        case 'fullPage':
            if (args.page && args.size) {
                return true;
            } else {
                throw new ExpressError('Both page and size must be specified in args object when passing fullPage as operation type.', 500);
            }
        case 'singleReport':
            if (args.reportId) {
                return true;
            } else {
                throw new ExpressError('A reportId must be specified in `args` object for operation type: singleReport', 500);
            }
        default:
            throw new ExpressError('Incorrect operation type', 500);
    }
}

module.exports = argsMatchOp;