import React from 'react';
import { connect } from 'react-redux';

import CommentEditor from './CommentEditor';
import Timeline from './Timeline';
import TimelineEvent from './TimelineEvent';

import './TicketUpdate.css';

class TicketUpdate extends React.PureComponent {
	render() {
		const { ticket, uploader, user, onComment } = this.props;
		const upload_icon = <span className="dashicons dashicons-upload"></span>;
		return <Timeline className="TicketUpdate">
			{ uploader ?
				<TimelineEvent compact icon={ upload_icon }>
					{ uploader }
				</TimelineEvent>
			: null }
			<TimelineEvent>
				<CommentEditor
					ticket={ ticket }
					user={ user }
					onSubmit={ text => onComment( text ) }
				/>
			</TimelineEvent>
		</Timeline>;
	}
}

export default connect(
	({ user }) => ({ user })
)( TicketUpdate );
