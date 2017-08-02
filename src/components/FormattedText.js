import React from 'react';

import parse from '../lib/text-parser';
import format from '../lib/text-formatter';

window.parser = parse;

export default class FormattedText extends React.PureComponent {
	render() {
		const { text } = this.props;

		return <div>{ format( parse( text ) ) }</div>;
	}
}
