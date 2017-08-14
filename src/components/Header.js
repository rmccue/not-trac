import React from 'react';

import './Header.css';

export default class Header extends React.PureComponent {
	render() {
		const { children, title } = this.props;

		return <div className="Header">
			<div className="wrapper">
				<h1>{ title }</h1>

				<nav>
					{ children }
				</nav>
			</div>
		</div>;
	}
}
Header.defaultProps = {
	user: null,
};
