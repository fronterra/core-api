const databaseOps = require('../operations/mongodb/databaseOps');
const argsMatchOp = require('./argsMatchOp');

const ExpressError = require('../ExpressError');

class Report {
    static async create() {}

    /**
     * `Report.read` takes exactly two arguments. The first parameter
     * is a string describing the type of read operation that the client
     * wishes to execute. It must be either: `search`, `fullPage`, 
     * or `singleReport`. The second parameter, `args`, is an object
     * containing several possible key-value combinations depending on
     * the specified operation type.

     * 
     * @param {String} operation
     * @param {Object} args
     */
    static async read(operation, args) {
        try {
            // throws error if operation and args are mismatched
            argsMatchOp(operation, args);

            // attempt connection with database
            const dbOps = await databaseOps('reports');

            switch (operation) {
                case 'search':
                    // calls `dbOps.search(args.query)`
                    return;
                case 'fullPage': 
                    // calls `dbOps.getPage(args.page, args.size)
                    return;
                case 'singleReport':
                    // calls `dbOps.getResource(args.reportId)`
                    return;
                default:
                    // default operation
                    return;
            }
            
        } catch (err) {
            throw new ExpressError(err.message, err.status);
        }
    }
    static async update() {}
    static async delete() {}
};

module.exports = Report;