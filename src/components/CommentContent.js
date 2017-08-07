import React from 'react';
import FormattedText from './FormattedText';

import './CommentContent.css';

export default ({ text }) => (
	<div className="CommentContent">
		<FormattedText text={ text } />
	</div>
);
