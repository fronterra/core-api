const databaseOps = require('../services/databaseOps');
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
            // check that `idArray` is an array
            if (!Array.isArray(idArray)) throw new ExpressError('idArray parameter is required and must be an Array containing at least one element', 400);

            // check that the array isn't empty
            if (idArray.length < 1) throw new ExpressError('idArray cannot be an empty array', 400);

            // attempt connection with database
            const dbOps = await databaseOps('reports');

            const result = readMany ? await dbOps.getPage()
        } catch (err) {
            throw new ExpressError(err.message, err.status);
        }
    }
    static async update() {}
    static async delete() {}
};

module.exports = Report;