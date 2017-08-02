<?php

date_default_timezone_set( 'UTC' );

require __DIR__ . '/vendor/autoload.php';

$error = function ( $data, $status = 500 ) {
	header('Content-Type: application/json', true, 500);
	$data['error'] = true;
	echo json_encode($data);
	exit;
};

// CORS request, allow all.
if ( isset( $_SERVER['HTTP_ORIGIN'] ) ) {
	header( 'Access-Control-Allow-Origin: ' . str_replace( [ "\r", "\n" ], '', $_SERVER['HTTP_ORIGIN'] ) );
}
header( 'Access-Control-Allow-Methods: POST, OPTIONS' );
header( 'Access-Control-Allow-Credentials: true' );

if ( $_SERVER['REQUEST_METHOD'] === 'OPTIONS' ) {
	header( 'Access-Control-Allow-Headers: Authorization, Content-Type', true, 200 );
	header( 'Access-Control-Allow-Methods: POST, OPTIONS' );
	header( 'Access-Control-Allow-Credentials: true' );
	header( 'Vary: Origin' );
	echo "Let's go.\n";
	exit;
}

if ( ! isset( $_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW'] ) ) {
	$error( [
		'message' => 'Username and password are required',
	], 401 );
}

$username = $_SERVER['PHP_AUTH_USER'];
$password = $_SERVER['PHP_AUTH_PW'];

$data = (object) json_decode( file_get_contents( 'php://input' ), true );

foreach ( [ 'method', 'parameters' ] as $key ) {
	if ( ! isset( $data->$key ) ) {
		$error([
			'message' => 'Missing required parameter.',
			'param'   => $key,
		], 400);
	}
}

$url = 'https://core.trac.wordpress.org/login/xmlrpc';
$headers = array(
	'Content-Type' => 'application/xml',
);

$encoder = new \Comodojo\Xmlrpc\XmlrpcEncoder();
$body = $encoder->encodeCall( $data->method, $data->parameters );
$options = array(
	'auth' => array( $username, $password ),
);

try {
	$response = Requests::post( $url, $headers, $body, $options );
	$response->throw_for_status();
} catch ( Exception $e ) {
	$error([
		'message' => sprintf( 'Received an error from Trac: %s', $e->getMessage() ),
		$e->getData(),
	]);
}

$decoder = new \Comodojo\Xmlrpc\XmlrpcDecoder();
$response = $decoder->decodeResponse( $response->body );

header('Content-Type: application/json', true, 200);
echo json_encode( $response );
