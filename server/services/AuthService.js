let APP_CONST = require(APP_PATH + '/config/constant');

module.exports = {

    /** function to generate token*/
    generateToken: function(reqBody) {
        let myCustPromise = new Promise((resolve, reject) => {
            let
                apiUrl = APP_CONST.BASE_URL + '/is/1.0.0/generatetoken',
                _request = require('request'),
                buffer64 = new Buffer(APP_CONST.CONSUMER_KEY + ":" + APP_CONST.SECRET_KEY).toString('base64'),
                headers = {
                    'Authorization': "Basic " + buffer64,
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
            _request({
                url: apiUrl,
                method: 'POST',
                'headers': headers,
                body: reqBody.domainId ? ("grant_type=password&username=" + reqBody.domainId + '/' + reqBody.username + "&password=" + reqBody.password) : ("grant_type=password&username=" + reqBody.username + "&password=" + reqBody.password)
            }, function(error, response, body) {
                if (response && response.statusCode && (response.statusCode == 200 || response.statusCode == 201)) {
                    body = JSON.parse(body);
                    resolve(body);
                } else {
                    try {
                        body = JSON.parse(body);
                        body.statusCode = response.statusCode;
                        reject(body);
                    } catch (parseErr) {
                        let body = {
                            "statusCode": response.statusCode,
                            "error-message": "Bad Request",
                            "error-auxiliary-message": APP_CONST.ERR_TOKEN_GEN_FAILED
                        };
                        reject(body);
                    }
                }
            });
        });
        return myCustPromise;
    }
   
}