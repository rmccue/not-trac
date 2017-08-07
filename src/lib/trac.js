// const API_URL = 'https://core.trac.wordpress.org/login/xmlrpc';
const PROXY_URL = 'http://localhost:3001/';

export default class TracAPI {
	constructor( user ) {
		this.user = user;
	}

	getHeaders() {
		const auth_string = [ this.user.username, this.user.password ].join( ':' );

		return {
			Authorization: `Basic ${ btoa( auth_string ) }`,
		}
	}

	call( method, parameters = [], types = null ) {
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...this.getHeaders(),
			},
			credentials: 'include',
			body: JSON.stringify( {
				method,
				parameters,
				types,
			} ),
		};

		return fetch( PROXY_URL, options )
			.then( resp => resp.json() );
	}
}
