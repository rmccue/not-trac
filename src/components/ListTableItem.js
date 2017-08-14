import React from 'react';

import './ListTableItem.css';

export default ({ children, className }) => (
	<li
		children={ children }
		className={ `ListTableItem ${className}` }
	/>
);
