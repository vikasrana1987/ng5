var models = require('./../models');
var passwordHash = require('password-hash');

exports.generatetoken = function(app, jwt) {
    return function(req, res) {
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
                    var token = jwt.sign(userObj, app.get('superSecret'), {
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
}

exports.validatetoken = function(app, jwt) {
    return function(req, res) {

        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            token = req.query.token;
        } else {
            token = req.body.token || req.query.token || req.headers['x-access-token'];
        }
        // decode token
        if (token && typeof token != undefined) {
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.status(401).send({
                        'success': false,
                        'error-message': 'Unclassified Authentication Failure',
                        'error-auxiliary': 'Access token is invalid. Please try with new Access token'
                    });
                } else {
                    return res.status(403).send({
                        'success': true,
                        'success-message': 'Token is Valid',
                        'success-auxiliary': 'Valid Token'
                    });
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({
                'success': false,
                'error-message': 'Unclassified Authentication Failure',
                'error-auxiliary': 'Missing authorization token. Please try with valid Access token.'
            });
        }
    }
}

// find all users
exports.getUsers = function(req, res, next) {
    models.User.findAll({
        attributes: ['id', 'firstName', 'lastName', 'email']
    }).then(function(users) {
        return res.status(200).send(JSON.stringify(users));
    });
}

// find user by id
exports.getUserById = function(req, res, next) {
    var userId = req.params.id;
    models.User.findById(userId, {
        attributes: ['id', 'firstName', 'lastName', 'email']
    }).then(function(user) {
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        } else {
            return res.status(200).send(JSON.stringify(user));
        }
    });
}