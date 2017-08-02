import Prism from 'prismjs';
import PropTypes from 'prop-types';
import React from 'react';

// Load extra Prism languages.
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-php';

// Load Prism theme.
import 'prismjs/themes/prism.css';

export default class CodeBlock extends React.PureComponent {
	render() {
		const { children, lang } = this.props;

		const language = Prism.languages[ lang ] || Prism.languages.clike;
		const highlighted = Prism.highlight( children, language );

		return <pre className={ `language-${ lang }` }>
			<code
				className={ `language-${ lang }` }
				dangerouslySetInnerHTML={{ __html: highlighted }}
			/>
		</pre>;
	}
}

CodeBlock.propTypes = {
	children: PropTypes.string.isRequired,
	lang: PropTypes.string,
};

CodeBlock.defaultProps = {
	lang: 'clike',
};
