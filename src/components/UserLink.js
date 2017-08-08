import React from 'react';
import { Link } from 'react-router-dom';

export default ({ user }) => (
	<Link className="UserLink" to={ `/user/${ user }` }>
		@{ user }
	</Link>
);
