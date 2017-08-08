import PropTypes from 'prop-types';
import React from 'react';

import parse from '../lib/text-parser';
import format from '../lib/text-formatter';

window.parser = parse;

export default class FormattedText extends React.PureComponent {
	render() {
		const { context, text } = this.props;

		return <div>{ format( parse( text ), context ) }</div>;
	}
}

FormattedText.propTypes = {
	context: PropTypes.object,
	text: PropTypes.string.isRequired,
};

FormattedText.defaultProps = {
	context: {},
};
