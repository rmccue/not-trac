import React from 'react';

import Dropdown from './Dropdown';

import './DropList.css';

export default function DropList( props ) {
	return <Dropdown
		{ ...props }
		className={ `DropList ${ props.className }` }
	/>;
}

DropList.defaultProps = {
	className: '',
};
