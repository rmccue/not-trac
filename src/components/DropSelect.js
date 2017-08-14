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
				items.map( item => {
					const value = typeof item === 'object' ? item.value : item;
					const title = typeof item === 'object' ? item.title : value;
					const key = typeof item === 'object' && 'id' in item ? item.id : value;

					const current = selected.indexOf( key ) >= 0;
					const className = current ? "DropSelect-item selected" : "DropSelect-item";

					return <li key={ key } className={ className }>
						<button onClick={ () => this.props.onSelect( value ) }>
							{ current ?
								<span className="dashicons dashicons-yes" />
							: null }
							{ title }
						</button>
					</li>;
				})
			}
		</Dropdown>;
	}
}

DropSelect.propTypes = {
	label: PropTypes.string.isRequired,
	loading: PropTypes.bool,
	items: PropTypes.list,
	selected: PropTypes.oneOfType([
		PropTypes.arrayOf( PropTypes.string ),
		PropTypes.string,
	]),
	title: PropTypes.string,
	onLoad: PropTypes.func,
	onSelect: PropTypes.func.isRequired,
};
DropSelect.defaultProps = {
	loading: false,
	selected: [],
};
