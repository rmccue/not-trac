import React from 'react';

import Comment from './Comment';
import CommentContent from './CommentContent';
import CommentMeta from './CommentMeta';
import Loading from './Loading';
import TicketChanges from './TicketChanges';
import TicketStatus from './TicketStatus';
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

		return <div className="Ticket">
			<div className="Ticket-header">
				<h1>#{ id }: { attributes.summary }</h1>
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
			</div>
			<div className="Ticket-main">
				<div className="Ticket-timeline">
					<Comment author={ attributes.reporter }>
						<CommentMeta
							author={ attributes.reporter }
							changes={ time_changed !== time_created ? [ {} ] : [] }
							number={ 0 }
							ticket={ id }
							timestamp={ time_created }
						/>
						<CommentContent text={ attributes.description } />
					</Comment>

					{ changes ?
						<TicketChanges
							changes={ changes }
							ticket={ id }
						/>
					: <Loading /> }
				</div>
				<TicketStatus attributes={ attributes } />
			</div>
		</div>;
	}
}
