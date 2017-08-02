import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from './Avatar';

import './Header.css';

export default class Header extends React.PureComponent {
	render() {
		const { user } = this.props;

		return <div className="Header">
			<div className="wrapper">
				<h1>Not Trac</h1>

				{ user ?
					<nav>
						<ul>
							<li>
								<Link to="/">Components</Link>
							</li>
							<li>
								<Avatar size={ 24 } user={ user.username } />
								@{ user.username }
							</li>
						</ul>
					</nav>
				: null }
			</div>
		</div>;
	}
}
Header.defaultProps = {
	user: null,
};
