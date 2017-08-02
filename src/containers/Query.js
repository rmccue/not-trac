import qs from 'query-string';
import React from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { set_query_params, set_query_results, set_ticket_data } from '../actions';
import Loading from '../components/Loading';
import QueryComponent from '../components/Query';
import Trac from '../lib/trac';
import { parseTicketResponse } from '../lib/workflow';

class Query extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			loading: true,
		};

		this.api = new Trac( props.user );
	}

	componentWillMount() {
		this.fetchResults( this.props.params );
	}

	componentWillReceiveProps( nextProps ) {
		if ( this.props.user !== nextProps.user ) {
			this.api = new Trac( nextProps.user );
		}
		if ( this.props.params !== nextProps.params ) {
			this.fetchResults( nextProps.params );
		}
	}

	fetchResults( params ) {
		const { dispatch, tickets } = this.props;

		this.setState({ loading: true });

		// Build our query using Trac's query language:
		// https://trac.edgewall.org/wiki/TracQuery#QueryLanguage
		const query = {
			status: '!closed',

			// Ordering
			order: 'time',
			desc: '1',

			// Pagination
			page: '1',

			...params,
		};
		const queries = Object.keys( query ).map( key => {
			const value = query[ key ];
			const comparison = '=';
			return key + comparison + value;
		});

		// Force pagination
		queries.push( 'max=25' );

		// Build ticket query.
		const qstr = queries.join( '&' );

		// Query for ticket IDs...
		this.api.call( 'ticket.query', [ qstr ] )
			.then( ids => {
				if ( 'faultCode' in ids ) {
					if ( ids.faultString.indexOf( 'beyond the number of pages' ) > 0 ) {
						dispatch( set_query_results( [] ) );
						this.setState({ loading: false });
						return;
					}

					console.log( ids );
					return;
				}

				dispatch( set_query_results( ids ) );

				// Then fetch details for all of them.
				const missing = ids.filter( id => !tickets[ id ] );
				const calls = missing.map( id => ({ methodName: 'ticket.get', params: [ id ] }) );
				if ( calls.length > 0 ) {
					this.api.call( 'system.multicall', [ calls ] ).then( data => {
						const tickets = data.map( item => parseTicketResponse( item[0] ) );

						tickets.forEach( item => {
							dispatch( set_ticket_data( item.id, item ) );
						});
						this.setState({ loading: false });
					});
				} else {
					this.setState({ loading: false });
				}
			});
	}

	onNext() {
		const { dispatch, params } = this.props;

		const currentPage = params.page ? parseInt( params.page, 10 ) : 1;

		const nextParams = {
			...params,
			page: currentPage + 1,
		}
		this.onSetParams( nextParams );
	}

	onPrevious() {
		const { dispatch, params } = this.props;

		const currentPage = params.page ? parseInt( params.page, 10 ) : 1;

		const nextParams = {
			...params,
			page: currentPage - 1,
		}
		this.onSetParams( nextParams );
	}

	onSetParams( params ) {
		const { history, location } = this.props;
		const nextLocation = {
			...location,
			search: '?' + qs.stringify( params ),
		};
		history.push( nextLocation );
	}

	render() {
		const { loading } = this.state;
		if ( loading ) {
			return <Loading />;
		}

		const { dispatch, query, params, tickets } = this.props;
		const { results } = query;

		const selectedTickets = results.map( id => tickets[ id ] );

		return <DocumentTitle title='Custom Query'>
			<QueryComponent
				params={ params }
				query={ query }
				tickets={ selectedTickets }
				onNext={ () => this.onNext() }
				onPrevious={ () => this.onPrevious() }
				onSetQuery={ nextParams => this.onSetParams( nextParams ) }
				onUpdateQuery={ nextParams => this.onSetParams( { ...params, ...nextParams } ) }
			/>
		</DocumentTitle>;
	}
}

export default withRouter( connect(
	({ query, tickets, user }) => ({ query, tickets, user })
)( Query ) );
