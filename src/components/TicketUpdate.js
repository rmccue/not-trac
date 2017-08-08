import React from 'react';
import { connect } from 'react-redux';

import AttachmentUpload from './AttachmentUpload';
import CommentEditor from './CommentEditor';
import Timeline from './Timeline';
import TimelineEvent from './TimelineEvent';

import './TicketUpdate.css';

class TicketUpdate extends React.PureComponent {
	render() {
		const { ticket, user, onComment } = this.props;
		const upload_icon = <span className="dashicons dashicons-upload"></span>;
		return <Timeline className="TicketUpdate">
			<TimelineEvent compact icon={ upload_icon }>
				<AttachmentUpload />
			</TimelineEvent>
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
