import React from 'react';
import { connect } from 'react-redux';

import AttachmentUpload from './AttachmentUpload';
import CommentEditor from './CommentEditor';
import Timeline from './Timeline';
import TimelineEvent from './TimelineEvent';

import './TicketUpdate.css';

class TicketUpdate extends React.PureComponent {
	render() {
		const { user } = this.props;
		const upload_icon = <span className="dashicons dashicons-upload"></span>;
		return <Timeline className="TicketUpdate">
			<TimelineEvent compact icon={ upload_icon }>
				<AttachmentUpload />
			</TimelineEvent>
			<TimelineEvent>
				<CommentEditor user={ user } />
			</TimelineEvent>
		</Timeline>;
	}
}

export default connect(
	({ user }) => ({ user })
)( TicketUpdate );
