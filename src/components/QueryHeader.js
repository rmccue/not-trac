import React from 'react';

import DropSelect from './DropSelect';
import LabelSelect from '../containers/selectors/LabelSelect';
import MilestoneSelect from '../containers/selectors/MilestoneSelect';

import './QueryHeader.css';

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

const Label = ({ text }) => <span>{ text } <span className="QueryHeader-drop-arrow">▼</span></span>;

export default class QueryHeader extends React.PureComponent {
	render() {
		const { children, params, onUpdateQuery } = this.props;

		const currentOrder = params.order || 'time';
		const currentOrderDesc = params.desc || '1';

		const matchedSort = SORT_OPTIONS.find( opt => {
			return currentOrder === opt.value.order && currentOrderDesc === opt.value.desc;
		});
		const currentSort = matchedSort ? matchedSort.id : '';

		return <div className="QueryHeader">
			<div className="QueryHeader-actions">
				{ children }
			</div>
			<nav>
				<ul className="QueryHeader-filter">
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
		</div>;
	}
}
