import React from 'react';

import './Avatar.css';

export default ({ user, size = 48 }) => (
	<img
		alt=""
		className="Avatar"
		src={
			`https://wordpress.org/grav-redirect.php?user=${ user }&s=${ size }`
		}
		srcSet={
			`https://wordpress.org/grav-redirect.php?user=${ user }&s=${ size * 2 } 2x`
		}
		style={{
			width: size,
			height: size
		}}
	/>
);
