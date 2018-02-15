/*----------------------------------------------------------------------------------------------------------
Module	 : LoginController
Created	 : 2017-05-17
Developed By : [ Sunny ]
Description	 : Contain the login Functionality Code
------------------------------------------------------------------------------------------------------------*/

let models = require('./../models');
let passwordHash = require('password-hash');
let jwt = require('jsonwebtoken');
let config = require('./../config/config');
class LoginController {
    login(req, res) {
        models.User.findOne({ where: { email: req.body.username } }).then(function(user) {

            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication failed.'
                });
            } else if (user) {
                // check if password matches
                if (passwordHash.verify(req.body.password, user.password)) {
                    var userObj = {
                        id: user.id,
                        username: user.username,
                        password: user.password
                    };
                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(userObj, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'You are logged in successfully.',
                        token: token
                    });
                } else {
                    res.status(401).json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                }

            }
        });
    }

    /** 
     * for logout
     */
    logOut(req, res) {
        let apiUrl = APP_CONST.BASE_URL + '/mpc/1.0.0/admin/master_account';
        let _m = new cLog.mObject(req.method, 'logout', apiUrl);
        _m.sc = 200;
        cLog.create(_m);
        return res.json({
            statusCode: 200,
        });
    }

    /** Api to check if Node server is
    running or not
    */
    healthCheck(req, res) {
        var _r = {
            "service_name": "MPC GUI",
            "service_version": "1.0.0",
            "service_host": "",
            "base_url": APP_CONST.BASE_URL
        };

        res.status(200).json(_r);
    }

}

module.exports = new LoginController();