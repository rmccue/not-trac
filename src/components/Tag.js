import React from 'react';
import stringHash from 'string-hash';

import './Tag.css';

window.hasher = stringHash;

const COLORS = [
	'red',
	'orange',
	'yellow',
	'green',
	'blue',
	'purple',
];

const getClassName = name => {
	const hash = stringHash( name );
	const color = COLORS[ hash % COLORS.length ];

	return `Tag color-${ color }`;
}

export default ({ icon, name }) => <span className={ getClassName( name ) }>{ icon || null }{ name }</span>;
