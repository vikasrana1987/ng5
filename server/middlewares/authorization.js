/**
 * Checking Token as Authorization header
 * in request body
 */
let jwt = require('jsonwebtoken');
let config = require('./../config/config');
module.exports = function(req, res, next) {
    let token;
    if (req.headers && req.headers.authorization) {
        let parts = req.headers.authorization.split(' ');

        if (parts.length == 2) {
            var scheme = parts[0],
                credentials = parts[1];
            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
                req.token = token;
                next();
            }

        } else {
            return res.status(401).json({ "error-message": "400 Bad Request", "error-auxiliary-message": "400 Bad Request" });
        }
    } else if (req.params.token) {
        token = req.params.token;
    } else if (req.query && req.query.token) {
        token = req.query.token;
    } else {
        token = req.body.token || req.query.token || req.headers['x-access-token'];
    }
    // decode token
    if (token && typeof token != undefined) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {
            console.log(decoded)
            if (err) {
                return res.status(401).send({
                    'success': false,
                    'error-message': 'Unclassified Authentication Failure',
                    'error-auxiliary': 'Access token is invalid. Please try with new Access token'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
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
};