const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('./server/config/config'); // get our config file
const cors = require('cors');

const app = express();

// load models
const models = require('./server/models');
// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

global.APP_PATH = path.resolve(__dirname) + '/server';

let whitelist = ['http://localhost:3000']
let corsOptions = {
    origin: function(origin, callback) {
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
app.use(cors(corsOptions));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

let router = express.Router(); // get an instance of the express Router

require('./server/routes/index')(app, router, jwt);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

//server.listen(port, () => console.log(`Running on localhost:${port}`));



// START THE SERVER
// =============================================================================
const server = http.createServer(app);

models.sequelize.authenticate()
    .then(function(err) {
        console.log('Connection has been established successfully.');
        models.sequelize.sync().then(function() {
            /**
             * Listen on provided port, on all network interfaces.
             */
            server.listen(port, function() {
                console.log('Express server listening on port ' + server.address().port);
            });
            server.on('error', onError);
            server.on('listening', onListening);
        });
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    console.log('Listening on ' + bind);
}