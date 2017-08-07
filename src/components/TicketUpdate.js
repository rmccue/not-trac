import React from 'react';
import { connect } from 'react-redux';

import CommentEditor from './CommentEditor';
import Timeline from './Timeline';
import TimelineEvent from './TimelineEvent';

import './TicketUpdate.css';

class TicketUpdate extends React.PureComponent {
	render() {
		const { user } = this.props;
		return <Timeline className="TicketUpdate">
			<TimelineEvent>
				<CommentEditor user={ user } />
			</TimelineEvent>
		</Timeline>;
	}
}

export default connect(
	({ user }) => ({ user })
)( TicketUpdate );
