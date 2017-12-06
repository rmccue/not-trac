const express = require( 'express' );
const proxy = require( './proxy' );
const basicAuth = require( 'express-basic-auth' );
const bodyParser = require('body-parser');
const app = express();

const PORT = parseInt( process.env.PORT || '3090', 10 );

const corsMiddleware = ( req, res, next ) => {
	const origin = req.get( 'Origin' );
	if ( origin ) {
		res.set( 'Access-Control-Allow-Origin', origin.replace( /\r|\n/, '' ) );
	}

	res.set( 'Access-Control-Allow-Headers', 'Authorization, Content-Type' );
	res.set( 'Access-Control-Allow-Methods', 'POST, OPTIONS' );
	res.set( 'Access-Control-Allow-Credentials', 'true' );
	res.set( 'Vary', 'Origin' );

	next();
};

app.post(
	'/proxy',
	basicAuth( {
		authorizer: () => true,
		unauthorizedResponse: () => ( { message: 'Username and password are required' } ),
	} ),
	bodyParser.json(),
	corsMiddleware,
	proxy
);

app.options(
	'/proxy',
	corsMiddleware,
	( req, res ) => {
		res.status( 200 );
		res.send( "Let's go.\n" );
	}
);

app.use( express.static( __dirname + '/build' ) );
app.get('/*', function(req, res){
	res.sendFile(__dirname + '/build/index.html');
});

app.use( ( err, req, res, next ) => {
	if ( err instanceof proxy.HttpError ) {
		const data = Object.assign( {}, err.data, { error: true } );

		res.status( err.code );
		res.set( 'Content-Type', 'application/json' );
		res.send( JSON.stringify( data ) );
		return next();
	}

	next( err );
} );

app.listen( PORT, () => console.log( `Trac proxy listening on port ${ PORT }` ) );
