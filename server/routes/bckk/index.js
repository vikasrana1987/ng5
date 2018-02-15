var _AUTH = require('./auth');
//var _ALBUM = require('./album');
module.exports = function(app, router, jwt) {

    /* Auth */
    router.post('/generatetoken', _AUTH.generatetoken(app, jwt));
    router.get('/validatetoken', _AUTH.validatetoken(app, jwt));
    /* End Auth */
    /* User */
    //router.get('/albums', _ALBUM.getAlbums);
    //router.get('/users/:id', _AUTH.getUserById);
    /* End User */

    // Send all other requests to the Angular app
    router.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });

}