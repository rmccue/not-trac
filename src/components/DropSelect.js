import PropTypes from 'prop-types';
import React from 'react';

import Dropdown from './Dropdown';
import Header from './Header';
import Spinner from './Spinner';

import './DropSelect.css';

export default class DropSelect extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			didLoad: false,
		};
	}

	onToggle( expanded ) {
		if ( expanded && ! this.state.didLoad && this.props.onLoad ) {
			this.props.onLoad();
		}
	}

	render() {
		const { items, label, loading, loadingText, title } = this.props;

		// Cast selected to array.
		const selected = typeof this.props.selected === "string" ? [ this.props.selected ] : this.props.selected;

		// Cast items to expected.
		const fullItems = items.map( value => {
			// Turn strings into full objects.
			if ( typeof value !== 'object' ) {
				return {
					title: value,
					value: value,
					id: value,
					selected: selected.indexOf( value ) >= 0,
				};
			}

			const item = { ...value };

			if ( ! ( 'id' in item ) ) {
				item.id = item.value;
			}
			item.selected = selected.indexOf( item.id ) >= 0;

			return item;
		});

		// Move selected items to the top, if we can.
		let orderedItems = [];
		if ( selected.length > 0 ) {
			const unselected = fullItems.filter( item => {
				if ( item.selected ) {
					// Remove from this list, and manually add.
					orderedItems.push( item );
					return false;
				}

				return true;
			});
			orderedItems = [ ...orderedItems, ...unselected ];
		} else {
			orderedItems = fullItems;
		}

		const header = title ? <Header title={ title } /> : null;
		return <Dropdown
			header={ header }
			label={ label }
			onToggle={ expanded => this.onToggle( expanded ) }
		>
			{ loading ?
				<li>
					<Spinner />
					{ loadingText }
				</li>
			:
				orderedItems.map( item => {
					const className = item.selected ? "DropSelect-item selected" : "DropSelect-item";

					return <li key={ item.id } className={ className }>
						<button
							onClick={ ( item.selected && this.props.onDeselect ) ?
								() => this.props.onDeselect( item.value )
							:
								() => this.props.onSelect( item.value )
							}
							type="button"
						>
							{ item.selected ?
								<span className="dashicons dashicons-yes" />
							: null }
							{ item.title }
						</button>
					</li>;
				})
			}
		</Dropdown>;
	}
}

DropSelect.propTypes = {
	label: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element,
	]).isRequired,
	loading: PropTypes.bool,
	items: PropTypes.list,
	selected: PropTypes.oneOfType([
		PropTypes.arrayOf( PropTypes.string ),
		PropTypes.string,
	]),
	title: PropTypes.string,
	onLoad: PropTypes.func,
	onSelect: PropTypes.func.isRequired,
	onDeselect: PropTypes.func,
};
DropSelect.defaultProps = {
	loading: false,
	selected: [],
};
