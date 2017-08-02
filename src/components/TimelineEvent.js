import PropTypes from 'prop-types';
import React from 'react';

import './TimelineEvent.css';

export default class TimelineEvent extends React.PureComponent {
	render() {
		const { children, compact, icon, ...attrs } = this.props;

		const className = `TimelineEvent ${ compact ? 'compact' : ''}`;
		return <li className={ className } { ...attrs }>
			{ icon ?
				<span className="TimelineEvent-icon">{ icon }</span>
			: null }
			{ children }
		</li>;
	}
}
TimelineEvent.propTypes = {
	compact: PropTypes.bool,
};
TimelineEvent.defaultProps = {
	compact: false,
};
