import React from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';

import AttachmentUpload from './AttachmentUpload';
import { push_ticket_change, set_ticket_attachments, set_ticket_changes, set_ticket_data } from '../actions';
import Loading from '../components/Loading';
import TicketComponent from '../components/Ticket';
import Trac from '../lib/trac';
import { parseAttachmentList, parseTicketResponse } from '../lib/workflow';

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

		// Load the full data in, if we're missing everything.
		if ( ! data ) {
			this.loadTicketAndChanges( id );
			return;
		}

		// Otherwise, load the bits we need.
		if ( ! data.attributes ) {
			this.loadTicket( id );
		}
		if ( ! data.changes ) {
			this.loadChanges( id );
		}
	}

	loadTicket( id ) {
		this.loadTicketAndChanges( id, 'ticket' );
	}

	loadChanges( id ) {
		this.loadTicketAndChanges( id, 'changes' );
	}

	loadTicketAndChanges( id, force = null ) {
		const { data, dispatch } = this.props;
		const calls = [];
		const handlers = [];

		if ( ! data || force === 'ticket' ) {
			calls.push({
				methodName: 'ticket.get',
				params: [ id ]
			});
			handlers.push( data => dispatch( set_ticket_data( id, parseTicketResponse( data ) ) ) );
		}
		if ( ! data || ! data.changes || force === 'changes' ) {
			calls.push({
				methodName: 'ticket.changeLog',
				params: [ id, 0 ]
			});
			handlers.push( data => dispatch( set_ticket_changes( id, data ) ) );
		}
		if ( ! data || ! data.attachments || force === 'attachments' ) {
			calls.push({
				methodName: 'ticket.listAttachments',
				params: [ id ]
			});
			handlers.push( data => dispatch( set_ticket_attachments( id, parseAttachmentList( data ) ) ) );
		}
		if ( calls.length < 1 ) {
			return;
		}

		this.loader = this.api.call( 'system.multicall', [ calls ] )
			.then( results => {
				results.forEach( ( data, index ) => {
					const callback = handlers[ index ];
					callback( data[0] );
				});
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
			new Date(),

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

		const uploader = <AttachmentUpload
			ticket={ data }
			onComplete={ () => this.loadTicketAndChanges( id, 'attachments' ) }
		/>;

		return <DocumentTitle title={ title }>
			<TicketComponent
				{ ...data }
				id={ parseInt( id, 10 ) }
				uploader={ uploader }
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
