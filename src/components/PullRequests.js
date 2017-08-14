import React from 'react';

import Button from './Button';
import Header from './Header';
import ListTable from './ListTable';
import ListTableItem from './ListTableItem';
import Loading from './Loading';
import TicketState from './TicketState';
import Time from './Time';

import './PullRequests.css';

const PullRequestItem = ({ item }) => {
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
			<Button>Select</Button>
		</div>
	</ListTableItem>;
};

export default class PullRequests extends React.PureComponent {
	render() {
		const { id, items, state } = this.props;

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
								onSelect={ () => this.props.onSelect( item ) }
							/>
						) }
					</ListTable>
				}
			</div>
		</div>;
	}
}
