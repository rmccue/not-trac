import React from 'react';
import PropTypes from 'prop-types';

import TicketChanges from '../components/TicketChanges';

export default class TicketComments extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			loading: true,
			data: null,
		}
	}

	componentDidMount() {
		const { id, since } = this.props;

		this.api.call( 'ticket.changeLog', [ id, since ] )
			.then( data => this.setState({ data, loading: false }) );
	}

	render() {
		const { data, loading } = this.state;

		if ( loading ) {
			return <p>Loading&hellip;</p>;
		}

		return <TicketChanges
			changes={ data }
		/>;
	}
}
TicketComments.propTypes = {
	id: PropTypes.number.isRequired,
	since: PropTypes.number,
};
TicketComments.defaultProps = {
	since: 0,
};
