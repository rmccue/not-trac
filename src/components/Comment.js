import PropTypes from 'prop-types';
import React from 'react';

import Avatar from './Avatar';

import './Comment.css';

export default class Comment extends React.PureComponent {
	render() {
		const { author, className, children } = this.props;

		return <div className={ `Comment ${className || ''}` }>
			<div className="Comment-col-avatar">
				<Avatar user={ author } />
			</div>
			<div className="Comment-col-main">
				{ children }
			</div>
		</div>;
	}
}

Comment.propTypes = {
	author: PropTypes.string.isRequired,
};
