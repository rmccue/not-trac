import React from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';

import { set_ticket_changes, set_ticket_data } from '../actions';
import Loading from '../components/Loading';
import TicketComponent from '../components/Ticket';
import Trac from '../lib/trac';
import { parseTicketResponse } from '../lib/workflow';

class Ticket extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			data: null,
			ticketChanges: null,
		};

		this.api = new Trac( props.user );
	}

	componentWillMount() {
		this.maybeLoadTicket( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		if ( this.props.user !== nextProps.user ) {
			this.api = new Trac( nextProps.user );
		}

		this.maybeLoadTicket( nextProps );
	}

	maybeLoadTicket( props ) {
		const { data, id } = props;
		if ( ! data ) {
			this.loadTicket( id );
		}
		if ( ! data || ! data.changes ) {
			this.loadChanges( id );
		}
	}

	loadTicket( id ) {
		const { dispatch } = this.props;

		console.log( 'loading ticket...' );

		this.api.call( 'ticket.get', [ id ] )
			.then( data => dispatch( set_ticket_data( id, parseTicketResponse( data ) ) ) );
	}

	loadChanges( id ) {
		const { dispatch } = this.props;
		this.api.call( 'ticket.changeLog', [ id, 0 ] )
			.then( changes => dispatch( set_ticket_changes( id, changes ) ) );
	}

	render() {
		const { data } = this.props;

		if ( ! data ) {
			return <Loading />;
		}

		return <DocumentTitle title={`#${ data.id }: ${ data.attributes.summary }`}>
			<TicketComponent { ...data } />
		</DocumentTitle>;
	}
}

export default connect(
	(state, props) => {
		return {
			data: state.tickets[ props.id ] || null,
			user: state.user,
		};
	}
)( Ticket );
