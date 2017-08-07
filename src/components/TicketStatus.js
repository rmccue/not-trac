import React from 'react';
import { Link } from 'react-router-dom';

import Tag from './Tag';

import './TicketStatus.css';

export default class TicketStatus extends React.PureComponent {
	render() {
		const { attributes } = this.props;

		if ( ! attributes ) {
			return <aside className="TicketStatus"></aside>;
		}

		const focuses = attributes.focuses ? attributes.focuses.split( ',' ).map( f => f.trim() ) : [];

		return <aside className="TicketStatus">
			<div>
				<h4>Owner</h4>
				<p>{ attributes.owner || 'No owner' }</p>
			</div>
			<div className="TicketStatus-keywords">
				<h4>Keywords</h4>
				<p>{ attributes.keywords ?
					attributes.keywords.split( ' ' ).map( tag => <span key={ tag }><Tag name={ tag } /></span> )
				: 'No keywords' }</p>
			</div>
			<div className="TicketStatus-components">
				<h4>Component &amp; Focuses</h4>
				<p className="TicketStatus-components-list">
					<span className="TicketStatus-component">
						<span className="dashicons dashicons-awards"></span>
						<Link to={ `/component/${ encodeURIComponent( attributes.component ) }`}>
							<Tag name={ attributes.component } />
						</Link>
					</span>

					{ focuses.map( focus =>
						<span key={ focus }>
							<span className="dashicons dashicons-visibility"></span>
							<Tag key={ focus } name={ focus } />
						</span>
					) }
				</p>
			</div>
			<div>
				<h4>Milestone</h4>
				<p>{ attributes.milestone || 'No milestone' }</p>
			</div>
			<div>
				<h4>Version</h4>
				<p>{ attributes.version || 'No version' }</p>
			</div>
		</aside>;
	}
}
