import React from 'react';

import './TicketState.css';

const TicketState = ({ state }) => {
	switch ( state ) {
		case 'accepted':
		case 'assigned':
		case 'new':
		case 'reopened':
		case 'reviewing':
			return <span className="TicketState state-open">{ state }</span>;

		case 'closed':
			return <span className="TicketState state-closed">{ state }</span>;

		default:
			return <span className="TicketState">{ state }</span>;
	}
};

export default TicketState;
