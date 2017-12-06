const xmlrpc = require( 'xmlrpc' );

const HttpError = function ( data, code = 500 ) {
	this.data = data;
	this.code = code;
};

const replacer = ( key, value ) => {
	if ( Buffer.isBuffer( value ) ) {
		return value.toString();
	} else if ( typeof value === 'object' && value.type === 'Buffer' ) {
		const buffer = Buffer.from( value.data );
		return buffer.toString();
	}

	return value;
};

module.exports = ( req, res ) => {
	const data = req.body;

	const missing = [ 'method', 'parameters' ].filter( key => ! ( key in req.body ) );
	if ( missing.length ) {
		throw new HttpError(
			{
				message: 'Missing required parameter.',
				param:   missing.join( ',' ),
			},
			400
		);
	}

	const client = xmlrpc.createSecureClient( {
		url: 'https://core.trac.wordpress.org/login/xmlrpc',
		basic_auth: {
			user: req.auth.user,
			pass: req.auth.password,
		}
	} );

	const types = data.types || {};
	let params;
	try {
		params = data.parameters.map( ( parameter, idx ) => {
			const type = types[ idx ];
			if ( ! type ) {
				return parameter;
			}

			switch ( type ) {
				case 'base64':
					return Buffer.from( parameter );

				default:
					throw new HttpError( {
						message: `Invalid type ${ type } for parameter ${ parameter }`,
						param: parameter,
					} );
			}
		} );
	} catch ( e ) {
		throw new HttpError( {
			message: e.message,
		}, 400 );
	}
	client.methodCall( data.method, data.parameters, ( err, value ) => {
		if ( err ) {
			throw new HttpError( {
				message: `Received an error from Trac`,
				data:    err,
			} );
		}
		res.set( 'Content-Type', 'application/json' );
		res.send( JSON.stringify( value, replacer ) );
	} );
};

module.exports.HttpError = HttpError;
