import moment from 'moment';
import React from 'react';

export default ({ timestamp }) => {
	const date = moment.unix( timestamp );
	return <time dateTime={ date.toISOString() }>{ date.fromNow() }</time>
};
