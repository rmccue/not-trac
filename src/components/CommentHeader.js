import React from 'react';

import './CommentHeader.css';

export default ({ children, className }) => (
	<div className={`CommentHeader ${className || ''}`}>
		{ children }
	</div>
);
