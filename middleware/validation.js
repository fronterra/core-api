const ExpressError = require('../ExpressError');

/**
 * Validates incoming request body for following
 * properties:
 * - `mediaFile` *from* `request.body.files`
 * 
 * 
 * And query string params for the following:
 * - `mediaId`
 * - `reportId`
 */
function validateMediaUpload(request, response, next) {
    try {
        // throws error if request is missing either its reportId or mediaId
        if (!request.query.reportId || !request.query.mediaId) throw new ExpressError('Query string parameters must contain both of the following properties: mediaId, reportId', 412);

        // throws error if no file was sent with request
        if (!request.files) throw new ExpressError('No files recieved', 412) // 412 status code === 'Precondition Not Met'

        // if no errors pass on to the function block
        return next();
    } catch (err) {
        return next(err);
    }
}

module.exports = { validateMediaUpload };