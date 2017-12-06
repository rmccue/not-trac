import qs from 'query-string';
import React from 'react';
import { Link } from 'react-router-dom';

import Loading from './Loading';
import QueryHeader from './QueryHeader';
import Tag from './Tag';
import TicketList from './TicketList';

import './Query.css';

export default class Query extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.milestoneComponent = ({ className, name }) => {
			const nextParams = {
				...this.props.params,
				milestone: name,
			};
			const search = '?' + qs.stringify( nextParams );
			return <Link className={ className } to={{ search, pathname: '/query' }}>
				<span className="dashicons dashicons-post-status" />
				{ name }
			</Link>;
		};
		this.labelComponent = ({ name }) => {
			const nextParams = {
				...this.props.params,
				keywords: '~' + name,
			};
			const search = '?' + qs.stringify( nextParams );
			return <Link to={{ search, pathname: '/query' }}>
				<Tag name={ name } />
			</Link>;
		};
	}

	render() {
		const { loading, params, tickets, onNext, onPrevious, onUpdateQuery } = this.props;

		const page = params.page ? parseInt( params.page, 10 ) : 1;

		const boardLink = {
			pathname: '/board',
			search: '?' + qs.stringify( params ),
		};

		return <div className="Query">
			<h1>Query</h1>
			<QueryHeader
				params={ params }
				onUpdateQuery={ onUpdateQuery }
			>
				<Link to={ boardLink }>
					<span className="dashicons dashicons-excerpt-view" />
					Switch to card view
				</Link>
			</QueryHeader>

			{ loading ? (
				<Loading />
			) : (
				tickets.length === 0 ? (
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
					<TicketList
						tickets={ tickets }
						labelComponent={ this.labelComponent }
						milestoneComponent={ this.milestoneComponent }
					/>
				)
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
