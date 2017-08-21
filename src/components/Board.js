import qs from 'query-string';
import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';
import Loading from './Loading';
import QueryHeader from './QueryHeader';
import Tag from './Tag';
import TicketList from './TicketList';

import './Board.css';

const COLUMNS = {
	'backlog': {
		title: 'Backlog',
	},
	'needs-patch': {
		title: 'Needs Patch',
		keywords: [],
	},
	'assigned': {
		title: 'Assigned (No Patch)',
	},
	'has-patch': {
		title: 'Has Patch',
		keywords: [ 'has-patch' ],
	},
	'commit': {
		title: 'Commit',
		keywords: [ 'has-patch', 'commit' ],
	},
};

const getColumn = ticket => {
	const keywords = ticket.attributes.keywords.split( ' ' ).map( k => k.trim() );

	if ( keywords.indexOf( 'has-patch' ) >= 0 ) {
		if ( keywords.indexOf( 'commit' ) >= 0 ) {
			return 'commit';
		}

		return 'has-patch';
	}

	if ( ticket.attributes.owner ) {
		return 'assigned';
	}

	return 'needs-patch';
};

const columnise = tickets => {
	const data = {};
	Object.keys( COLUMNS ).forEach( key => {
		data[ key ] = {
			...COLUMNS[ key ],
			tickets: [],
		}
	});
	tickets.forEach( ticket => {
		const column = getColumn( ticket );
		data[ column ].tickets.push( ticket );
	});
	return data;
};

export default class Board extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.milestoneComponent = ({ className, name }) => {
			const nextParams = {
				...this.props.params,
				milestone: name,
			};
			const search = '?' + qs.stringify( nextParams );
			return <Link className={ className } to={{ search }}>
				<span className="dashicons dashicons-post-status" />
				{ name }
			</Link>;
		};
		this.labelComponent = () => null;
	}

	render() {
		const { loading, params, tickets, onUpdateQuery } = this.props;

		const data = columnise( tickets );

		return <div className="Board">
			<QueryHeader
				params={ params }
				onUpdateQuery={ onUpdateQuery }
			/>
			{ loading ? (
				<Loading />
			) : (
				<div className="Board-columns">
					{ Object.keys( data ).map( name => {
						const column = data[ name ];
						return <div key={ name } className="Board-column">
							<Header title={ column.title } />
							{ column.tickets.length > 0 ?
								<TicketList
									tickets={ column.tickets }
									labelComponent={ this.labelComponent }
									milestoneComponent={ this.milestoneComponent }
								/>
							:
								<p className="Board-empty">No items.</p>
							}
						</div>;
					} ) }
				</div>
			) }
		</div>;
	}
}
