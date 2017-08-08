import PropTypes from 'prop-types';
import React from 'react';
import FormattedText from './FormattedText';

import './CommentContent.css';

const CommentContent = ({ text, ticket }) => (
	<div className="CommentContent">
		<FormattedText
			text={ text }
			context={{ ticket }}
		/>
	</div>
);

CommentContent.propTypes = {
	text: PropTypes.string.isRequired,
	ticket: PropTypes.number.isRequired,
};

export default CommentContent;
