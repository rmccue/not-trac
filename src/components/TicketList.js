import React from 'react';

import ListTable from './ListTable';
import TicketListItem from './TicketListItem';

export default class TicketList extends React.PureComponent {
	render() {
		const { tickets } = this.props;

		return <ListTable>
			{ tickets.map( ticket => <TicketListItem key={ ticket.id } ticket={ ticket } /> ) }
		</ListTable>
	}
}
