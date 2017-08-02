import React from 'react';

import TicketListItem from './TicketListItem';

import './TicketList.css';

export default class TicketList extends React.PureComponent {
	render() {
		const { tickets } = this.props;

		return <ul className="TicketList">
			{ tickets.map( ticket => <TicketListItem key={ ticket.id } ticket={ ticket } /> ) }
		</ul>
	}
}
