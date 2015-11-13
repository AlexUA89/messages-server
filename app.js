var express = require( 'express' );
var logger = require('libs/log')
var expressLayouts = require( 'express-ejs-layouts' );
var errorHandler = require('middlewares/errorHandler')

var router = require( './routes' );
var config = require( 'configuration' );

var mailerHelper = require( 'helpers' ).mailerHelper;
var flash = require( 'connect-flash' );

var morgan = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var bodyParser = require( 'body-parser' );
var session = require( 'express-session' );
var requestValidator = require( 'express-validator' );

var historyCleaner = require('bundles/historyCleaner');

var app = express();

mailerHelper.getMailer( app );

app.set( 'view engine', 'ejs' );
app.set( 'layout', 'app' ); // defaults to 'layout'

app.use( morgan( 'dev' ) ); // log every request to the console
app.use( cookieParser() ); // read cookies (needed for auth)
app.use( bodyParser() ); // parsing body of POST requests
app.use( requestValidator() ); //Checking request. Should be after bodyParser

app.use( express.static( 'public' ) ); //specify the public directory
app.use( expressLayouts );

app.use( session( { secret: config.get( 'app_key' ) } ) ); // session secret

app.use( flash() ); // use connect-flash for flash messages stored in session

app.locals.pageTitle = 'Social Map API';

//TODO uncoment for prod
//historyCleaner.init(app);

app.use(require('express-domain-middleware'));

router.setRoutes( app );

errorHandler.init(app);

var port;
if(!!process.env.PORT){
    port = process.env.PORT;
} else {
    port = config.get( "port" );
}

logger.crit('trying use port ' + port );

var server = app.listen( port, function () {
    logger.crit('On port ' + port );
} );

require('libs/log');

exports.app = app;