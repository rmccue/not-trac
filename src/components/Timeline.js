import React from 'react';

import './Timeline.css';

export default ({ children, className }) => (
	<ul className={ `Timeline ${ className || '' }` }>
		{ children }
	</ul>
);
