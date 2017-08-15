import PropTypes from 'prop-types';
import React from 'react';

import './Dropdown.css';

export default class Dropdown extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			expanded: false,
		};
		this.documentClickListener = e => this.onDocumentClick( e );
	}

	onDocumentClick( e ) {
		// Ignore events inside the dropdown.
		if ( ! this.root || this.root.contains( e.target ) ) {
			return;
		}

		// Remove handler.
		document.removeEventListener( 'click', this.documentClickListener );

		this.setState({ expanded: false });
		this.props.onToggle( false );
	}

	onToggle( e ) {
		e.preventDefault();

		const { expanded } = this.state;
		if ( ! expanded ) {
			// Hide on the next click anywhere else.
			document.addEventListener( 'click', this.documentClickListener );
		} else if ( this.documentClickListener ) {
			// Remove handler.
			document.removeEventListener( 'click', this.documentClickListener );
		}

		this.setState({ expanded: ! expanded });
		this.props.onToggle( ! expanded );
	}

	render() {
		const { children, header, label } = this.props;
		const { expanded } = this.state;

		const className = expanded ? 'Dropdown expanded' : 'Dropdown';

		return <div className={ className } ref={ ref => this.root = ref }>
			<button
				className="Dropdown-trigger"
				onClick={ e => this.onToggle( e ) }
				type="button"
			>
				{ label }
			</button>

			<div className="Dropdown-content">
				{ header }
				<ul className="Dropdown-list" onClick={ () => this.setState({ expanded: false }) }>
					{ children }
				</ul>
			</div>
		</div>;
	}
}

Dropdown.propTypes = {
	label: PropTypes.string.isRequired,
};

Dropdown.defaultProps = {
	onToggle: () => {},
};
