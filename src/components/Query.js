import React from 'react';

import TicketList from './TicketList';

import './Query.css';

export default class Query extends React.PureComponent {
	render() {
		const { params, tickets, onNext, onPrevious, onUpdateQuery } = this.props;

		const page = params.page ? parseInt( params.page, 10 ) : 1;

		return <div className="Query">
			<h1>Query</h1>
			<div className="Query-header">
				<div className="Query-count" />
				<nav>
					<ul>
						<li><a href="#">Milestones &#9660;</a></li>
						<li><a href="#">Sort &#9660;</a></li>
					</ul>
				</nav>
			</div>
			{ tickets.length === 0 ? (
				page > 1 ? (
					<p className="Query-empty">
						No results, you might be out of pages.
						<button
							onClick={ () => onUpdateQuery({ page: 1 }) }
							type="button"
						>Try page 1?</button></p>
				) : (
					<p className="Query-empty">No results for your query.</p>
				)
			) : (
				<TicketList tickets={ tickets } />
			) }
			<div className="Query-footer">
				<p>
					<button
						disabled={ page === 1 }
						onClick={ () => onPrevious() }
						type="button"
					>
						Previous
					</button>
					<span className="Query-page-num">{ page }</span>
					<button
						disabled={ tickets.length < 25 }
						onClick={ () => onNext() }
						type="button"
					>
						Next
					</button>
				</p>
				<p>
					<span className="dashicons dashicons-info"></span>
					{ ' ' }
					Unfortunately, Trac doesn't support pagination, so I can't tell you how many pages are left!
				</p>
			</div>
		</div>;
	}
}
