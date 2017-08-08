import moment from 'moment';
import React from 'react';

export default ({ timestamp }) => {
	const date = moment.unix( timestamp );
	return <time
		children={ date.fromNow() }
		dateTime={ date.toISOString() }
		title={ date.format( 'LLLL' ) }
	/>;
};
