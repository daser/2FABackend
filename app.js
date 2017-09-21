'use strict';


if(process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
    require('dotenv').config();
}


//=============================================================================
/**
 * Module dependencies
 */
//=============================================================================
const
      express = require('express'),
      helmet = require('helmet'),
      nextocache = require('nocache'),
      hpp = require('hpp'),
      bParser = require('body-parser'),
      mongoose = require('mongoose'),
      log4js = require('log4js'),
      log = require('./helpers/logger').getLogger('APP');



//=============================================================================
/**
 * express instance
 */
//=============================================================================
const app = express();
//=============================================================================
/**
 * Module variables
 */
//=============================================================================
const
    port = process.env.PORT,
    env = process.env.NODE_ENV,
    DBURL = process.env.DBURL;
let db;
//=============================================================================
/**
 * App config
 */
//=============================================================================
app.set('port', port);
app.set('env', env);
const routes = require('./routes/routes');
//=============================================================================
/**
 * database config
 */
//=============================================================================

mongoose.Promise = require('bluebird');

var options = {
  useMongoClient: true,
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30
};

mongoose.connect(DBURL, options);
db = mongoose.connection;
db.on('error', err => {
  console.error('There was a db connection error');
  return  console.error(err.message);
});
db.once('connected', () => {
  return console.log('Successfully connected to ' + DBURL);
});
db.once('disconnected', () => {
  return console.error('Successfully disconnected from ' + DBURL);
});
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.error('dBase connection closed due to app termination');
    return process.exit(0);
  });
});
//=============================================================================
/**
 * Module middleware
 */
//=============================================================================
if(env != 'production') {
    require('clarify');
    app.use(require('morgan')('dev'));
}
// app.use(helmet());
// app.use(nocache());
app.use(log4js.connectLogger(log, { level: 'auto' }));
app.use(bParser.json());
app.use(bParser.urlencoded({extended: true}));
//app.use(hpp());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    if(req.method == 'OPTIONS') {
        res.status(200).end();
    }
    else {
        next();
    }
});




//=============================================================================
/**
 * Routes
 */
//=============================================================================
app.get('/test', (req, res) => {
    return res.status(200).json('OK');
});

app.get('/', (req, res) => {
    return res.status(200).json('Welcome to the User Management Microservice');
});

app.use('/otpapi', routes);
//=============================================================================
/**
 * Export app
 */
//=============================================================================
module.exports = app;
//=============================================================================
