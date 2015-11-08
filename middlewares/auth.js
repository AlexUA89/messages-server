/**
 * Checks if user is logged in based on the session
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.isLoggedIn = function ( req, res, next ) {

    // if user is authenticated in the session, carry on
    if ( req.isAuthenticated() ) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect( '/' );
};

exports.isAdmin = function(req, res, next) {
    return next();
};
