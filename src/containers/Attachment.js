import React from 'react';
import { connect } from 'react-redux';

import AttachmentComponent from '../components/Attachment';
import Trac from '../lib/trac';

class Attachment extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			data: null,
		};

		this.api = new Trac( props.user );
	}

	componentDidMount() {
		const { id, ticket } = this.props;

		this.api.call( 'ticket.getAttachment', [ ticket, id ] )
			.then( data => this.setState({ data }) );
	}

	render() {
		const { id, ticket } = this.props;
		const { data } = this.state;

		return <AttachmentComponent
			data={ data }
			id={ id }
			isLoading={ ! data }
			ticket={ ticket }
		/>;
	}
}
export default connect(
	({ user }) => ({ user })
)( Attachment );
