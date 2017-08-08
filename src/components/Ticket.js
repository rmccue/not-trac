import React from 'react';

import Comment from './Comment';
import CommentContent from './CommentContent';
import CommentMeta from './CommentMeta';
import Loading from './Loading';
import TicketChanges from './TicketChanges';
import TicketStatus from './TicketStatus';
import TicketUpdate from './TicketUpdate';
import Time from './Time';

import './Ticket.css';

const TicketState = ({ state }) => {
	switch ( state ) {
		case 'accepted':
		case 'assigned':
		case 'new':
		case 'reopened':
		case 'reviewing':
			return <span className="Ticket-state state-open">{ state }</span>;

		case 'closed':
			return <span className="Ticket-state state-closed">{ state }</span>;

		default:
			return <span className="Ticket-state">{ state }</span>;
	}
};

export default class Ticket extends React.PureComponent {
	render() {
		const { id, time_created, time_changed, attributes, changes } = this.props;

		const commentCount = changes ? changes.filter( change => change[2] === 'comment' ).length : 0;

		const summary = attributes ? attributes.summary : 'Loading...';

		return <div className="Ticket">
			<div className="Ticket-header">
				<h1>#{ id }: { summary }</h1>
				{ attributes ?
					<p>
						<TicketState state={ attributes.status } />
						{ attributes.reporter } opened this issue <Time timestamp={ attributes.time } />
						<span> &bull; { commentCount } comments</span>
						<span> &bull; </span>
						<a href={ `https://core.trac.wordpress.org/ticket/${ id }` }>
							<span className="dashicons dashicons-external"></span>
							Open on Trac
						</a>
					</p>
				: null }
			</div>
			<div className="Ticket-main">
				<div className="Ticket-timeline">
					{ attributes ?
						<Comment author={ attributes.reporter }>
							<CommentMeta
								author={ attributes.reporter }
								changes={ time_changed !== time_created ? [ {} ] : [] }
								number={ 0 }
								ticket={ id }
								timestamp={ time_created }
							/>
							<CommentContent
								text={ attributes.description }
								ticket={ id }
							/>
						</Comment>
					: <Loading /> }

					{ changes ?
						<TicketChanges
							attachments={ this.props.attachments }
							changes={ changes }
							ticket={ id }
						/>
					: <Loading /> }

					<TicketUpdate
						ticket={ id }
						onComment={ text => this.props.onComment( text ) }
					/>
				</div>
				<TicketStatus attributes={ attributes } />
			</div>
		</div>;
	}
}
