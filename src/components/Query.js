import React from 'react';

import DropSelect from './DropSelect';
import Loading from './Loading';
import TicketList from './TicketList';
import LabelSelect from '../containers/selectors/LabelSelect';
import MilestoneSelect from '../containers/selectors/MilestoneSelect';

import './Query.css';

const SORT_OPTIONS = [
	{
		id: 'new',
		title: 'Newest',
		value: {
			order: 'time',
			desc: '1',
		},
	},
	{
		id: 'old',
		title: 'Oldest',
		value: {
			order: 'time',
			desc: '0',
		},
	},
	{
		id: 'new-update',
		title: 'Most recently updated',
		value: {
			order: 'changetime',
			desc: '1',
		},
	},
	{
		id: 'old-update',
		title: 'Least recently updated',
		value: {
			order: 'changetime',
			desc: '0',
		},
	},
];

const Label = ({ text }) => <span>{ text } <span className="Query-drop-arrow">▼</span></span>;

export default class Query extends React.PureComponent {
	render() {
		const { loading, params, tickets, onNext, onPrevious, onUpdateQuery } = this.props;

		const page = params.page ? parseInt( params.page, 10 ) : 1;

		const matchedSort = SORT_OPTIONS.find( opt => {
			return params.order === opt.value.order && params.desc === opt.value.desc;
		});
		const currentSort = matchedSort ? matchedSort.id : '';

		return <div className="Query">
			<h1>Query</h1>
			<div className="Query-header">
				<div className="Query-count" />
				<nav>
					<ul className="Query-filter">
						<li>
							<LabelSelect
								label={ <Label text="Labels" /> }
								selected={ params.keywords }
								onSelect={ value => onUpdateQuery( value ) }
							/>
						</li>

						<li>
							<MilestoneSelect
								label={ <Label text="Milestones" /> }
								selected={ params.milestone }
								onSelect={ milestone => onUpdateQuery({ milestone }) }
							/>
						</li>

						<li>
							<DropSelect
								label={ <Label text="Sort" /> }
								items={ SORT_OPTIONS }
								selected={ currentSort }
								onSelect={ value => onUpdateQuery( value ) }
							/>
						</li>
					</ul>
				</nav>
			</div>
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
					<TicketList tickets={ tickets } />
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
