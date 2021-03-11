const ExpressError = require('../ExpressError');

/**
 * 
 */
function validateMediaUpload(request, response, next) {
    try {
        // throws error if no file was sent with request
        if (!request.files) throw new ExpressError('No files recieved', 412) // 412 status code === 'Precondition Not Met'

        // throws error if request is missing either its reportId or mediaId
        if (!request.body.reportId || !request.body.mediaId) throw new ExpressError('Request body must contain both of the following properties: mediaId, reportId');

        // if no errors pass on to the function block
        return next();
    } catch (err) {
        return next(err);
    }
}

module.exports = { validateMediaUpload };