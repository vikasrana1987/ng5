module.exports = function(app, router) {
    let Authorization = require(APP_PATH + '/middlewares/authorization');
    let controller = require(APP_PATH + '/controllers/authcontroller');
    router.post('/login', controller.login);
    //router.get('/validate', Authorization, controller.validate);
}