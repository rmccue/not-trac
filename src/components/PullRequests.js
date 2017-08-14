import React from 'react';

import Button from './Button';
import Header from './Header';
import ListTable from './ListTable';
import ListTableItem from './ListTableItem';
import Loading from './Loading';
import Spinner from './Spinner';
import TicketState from './TicketState';
import Time from './Time';

import './PullRequests.css';

const PullRequestItem = ({ item, loading, onSelect }) => {
	return <ListTableItem>
		<div className="PullRequests-state">
			<TicketState
				state={ item.state === 'open' ? 'new' : 'closed' }
			/>
		</div>
		<div className="col-main">
			<p className="col-main-title">
				<a href={ item.html_url } target="_blank">
					{ item.title }
					{ ' ' }
					<span className="dashicons dashicons-external"></span>
				</a>
			</p>

			<small>
				#{ item.number }
				{ ' opened ' }
				<Time date={ item.created_at } />
				{ ' by ' }
				@{ item.user.login }
			</small>
		</div>
		<div>
			{ loading ?
				<Button fake>
					<Spinner />
					{ ' Loading' }
					&hellip;
				</Button>
			:
				<Button onClick={ onSelect }>Select</Button>
			}
		</div>
	</ListTableItem>;
};

export default class PullRequests extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			loading: null,
		};
	}

	onSelect( pull ) {
		const { id } = this.props;

		// Start the loader.
		this.setState({ loading: pull.id });

		// Build diff URL manually to avoid CORS problems.
		const diff_url = `https://api.github.com/repos/WordPress/wordpress-develop/pulls/${ pull.number }`;
		const headers = {
			Accept: 'application/vnd.github.v3.diff',
		};
		fetch( diff_url, { headers } )
			.then( resp => resp.blob() )
			.then( file => {
				// Extend file with File-like properties.
				file.name = `${ id }.diff`;

				this.props.onSelect( pull, file );
			});
	}

	render() {
		const { id, items, state } = this.props;
		const { loading } = this.state;

		console.log( this.props );

		return <div className="PullRequests">
			<Header title={ `Attach pull request to #${ id }` }>
				<ul>
					<li>
						<a onClick={ () => this.props.onReload() }>
							Reload
						</a>
					</li>
					<li>
						<a onClick={ () => this.props.onCancel() }>
							Cancel
						</a>
					</li>
				</ul>
			</Header>
			<div className="PullRequests-content">
				{ state === 'loading' ?
					<Loading />
				:
					<ListTable>
						{ items.map( item =>
							<PullRequestItem
								key={ item.id }
								item={ item }
								loading={ item.id === loading }
								onSelect={ () => this.onSelect( item ) }
							/>
						) }
					</ListTable>
				}
			</div>
		</div>;
	}
}
