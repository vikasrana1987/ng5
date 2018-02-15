module.exports = function(app, router, jwt) {

    /** Requiring all routes file here */
    require(APP_PATH + '/routes/auth.js')(app, router);
    // all of our routes will be prefixed with /api
    app.use('/api', router);
}