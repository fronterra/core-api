require('dotenv').config();

module.exports = function () {
    return {
        PORT: process.env.PORT
    }
}();