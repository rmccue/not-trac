import React from 'react';

import './CommentHeader.css';

export default ({ children, classname }) => (
	<div className={`CommentHeader ${classname || ''}`}>
		{ children }
	</div>
);
