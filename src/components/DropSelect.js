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

					return <li key={ key } className="DropSelect-item">
						<button onClick={ () => this.props.onSelect( value ) }>
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
	title: PropTypes.string,
	onLoad: PropTypes.func,
	onSelect: PropTypes.func.isRequired,
};
DropSelect.defaultProps = {
	loading: false,
};
