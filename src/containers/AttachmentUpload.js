import React from 'react';
import { connect } from 'react-redux';

import { push_attachment, push_ticket_change, update_prs } from '../actions';
import AttachmentUploadComponent from '../components/AttachmentUpload';

class AttachmentUpload extends React.PureComponent {
	componentDidMount() {
		const { dispatch, prs } = this.props;
		if ( ! prs.state ) {
			dispatch( update_prs() );
		}
	}

	onUpload( upload ) {
		const { dispatch, ticket, user } = this.props;
		const { data, description, filename } = upload;

		const id = parseInt( ticket.id, 10 );

		const parameters = [
			// int ticket
			id,

			// string filename
			filename,

			// string description
			description,

			// Binary data
			data,

			// boolean replace=True
			false,
		];
		const types = {
			// Binary data
			3: 'base64',
		};

		// Optimistically render.
		const tempTimestamp = parseInt( Date.now() / 1000, 10 );
		const change = [
			// timestamp
			tempTimestamp,

			// author
			user.username,

			// field
			'attachment',

			// oldval
			'',

			// newval (filename)
			filename,

			// permanent
			true,
		];
		const tempAttachment = {
			id: filename,
			description,
			size: 0,
			timestamp: tempTimestamp,
			author: user.username,
			isUploading: true,
		};
		dispatch( push_ticket_change( id, change ) );
		dispatch( push_attachment( id, tempAttachment ) );

		// And finally, save.
		this.api.call( 'ticket.putAttachment', parameters, types )
			.then( () => {
				// Reload changes and attachments.
				this.loadTicketAndChanges( id, 'attachments' );
			});
	}

	render() {
		const { dispatch, prs, ticket } = this.props;

		if ( ! ticket ) {
			return null;
		}

		return <AttachmentUploadComponent
			prs={ prs }
			ticket={ ticket }
			onLoadPulls={ () => dispatch( update_prs() ) }
			onUpload={ upload => this.onUpload( upload ) }
		/>;
	}
}

export default connect(
	({ prs, user }) => ({ prs, user })
)( AttachmentUpload );
