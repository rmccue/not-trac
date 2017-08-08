import React from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';

import { push_ticket_change, set_ticket_changes, set_ticket_data } from '../actions';
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
		if ( this.loader ) {
			return;
		}

		if ( ! data ) {
			this.loadTicketAndChanges( id );
		} else if ( ! data.attributes ) {
			this.loadTicket( id );
		} else if ( ! data.changes ) {
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

	loadTicketAndChanges( id ) {
		const { dispatch } = this.props;
		const calls = [
			{
				methodName: 'ticket.get',
				params: [ id ]
			},
			{
				methodName: 'ticket.changeLog',
				params: [ id, 0 ]
			},
		];
		this.loader = this.api.call( 'system.multicall', [ calls ] )
			.then( results => {
				dispatch( set_ticket_data( id, parseTicketResponse( results[0][0] ) ) );
				dispatch( set_ticket_changes( id, results[1][0] ) );
				this.loader = null;
			});
	}

	onComment( text ) {
		const { data, dispatch, user } = this.props;

		const parameters = [
			// int id
			data.id,

			// string comment
			text,

			// struct attributes={}
			{
				// Don't alter attributes ("leave as new", e.g.)
				'action': 'leave',

				// Hack.
				'_ts': data.attributes._ts,
				'view_time': `${data.attributes._ts}`
			},
			// boolean notify=False
			true,
			// string author=""
			// DateTime when=None
		];

		// Optimistically render.
		const change = [
			// timestamp
			parseInt( Date.now() / 1000, 10 ),

			// author
			user.username,

			// field
			'comment',

			// oldval (number)
			'??',

			// newval (text)
			text,

			// permanent
			true,
		];
		dispatch( push_ticket_change( data.id, change ) );

		// And finally, save.
		this.api.call( 'ticket.update', parameters )
			.then( data => {
				// Update data from response...
				dispatch( set_ticket_data( data.id, parseTicketResponse( data ) ) );

				// ...and reload the changes.
				this.loadChanges();
			});
	}

	render() {
		const { data, id } = this.props;

		if ( ! data ) {
			return <Loading />;
		}

		const title = data.attributes ?
			`#${ id }: ${ data.attributes.summary }` :
			`#${ id }: Loading...`;

		return <DocumentTitle title={ title }>
			<TicketComponent
				{ ...data }
				id={ parseInt( id, 10 ) }
				onComment={ text => this.onComment( text ) }
			/>
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
