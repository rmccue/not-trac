import React from 'react';
import { connect } from 'react-redux';

import DropSelect from '../../components/DropSelect';
import Trac from '../../lib/trac';

class MilestoneSelect extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			items: [],
			loading: true,
		};

		this.api = new Trac( props.user );
	}

	onLoad() {
		this.api.call( 'ticket.milestone.getAll' )
			.then( items => this.setState({ items: items.reverse(), loading: false }) );
	}

	render() {
		const { label, selected } = this.props;
		const { loading, items } = this.state;

		return <DropSelect
			items={ items }
			label={ label }
			loading={ loading }
			loadingText="Loading milestones…"
			title="Select a milestone"
			selected={ selected }
			onDeselect={ () => this.props.onSelect( undefined ) }
			onLoad={ () => this.onLoad() }
			onSelect={ this.props.onSelect }
		/>;
	}
}

MilestoneSelect.defaultProps = {
	label: "Milestones",
};

export default connect(
	({ user }) => ({ user })
)( MilestoneSelect );
