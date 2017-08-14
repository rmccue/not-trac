import moment from 'moment';
import React from 'react';

export default props => {
	let date;
	if ( props.date ) {
		date = moment( props.date );
	} else {
		date = moment.unix( props.timestamp );
	}

	return <time
		children={ date.fromNow() }
		dateTime={ date.toISOString() }
		title={ date.format( 'LLLL' ) }
	/>;
};
