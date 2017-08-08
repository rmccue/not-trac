import PropTypes from 'prop-types';
import React from 'react';

import './TimelineEvent.css';

export default class TimelineEvent extends React.PureComponent {
	render() {
		const { children, closed, compact, icon, workflow, ...attrs } = this.props;

		const className = [
			'TimelineEvent',
			closed ? 'closed' : null,
			compact ? 'compact' : null,
			workflow ? 'workflow' : null,
		].filter( c => !! c ).join( ' ' );
		return <li className={ className } { ...attrs }>
			{ icon ?
				<span className="TimelineEvent-icon">{ icon }</span>
			: null }
			{ children }
		</li>;
	}
}
TimelineEvent.propTypes = {
	closed: PropTypes.bool,
	compact: PropTypes.bool,
	workflow: PropTypes.bool,
};
TimelineEvent.defaultProps = {
	closed: false,
	compact: false,
	workflow: false,
};
