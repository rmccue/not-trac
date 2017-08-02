import React from 'react';
import { Link } from 'react-router-dom';

import CodeBlock from '../components/CodeBlock';
import Loading from './Loading';

const guessLanguage = filename => {
	const parts = filename.split( '.' );
	const ext = parts.pop();

	switch ( ext ) {
		case 'diff':
		case 'patch':
			return 'diff';

		case 'php':
			return 'php';

		default:
			return 'diff';
	}
};

export default class Attachment extends React.Component {
	render() {
		const { data, id, isLoading, ticket } = this.props;

		const lang = guessLanguage( id );

		return <div className="Attachment">
			<div className="Ticket-header">
				<h1>
					<Link to={ `/ticket/${ ticket }` }>
						#{ ticket }
					</Link>
					{ ': ' }
					{ id }
				</h1>
			</div>

			{ isLoading ?
				<Loading />
			:
				<CodeBlock lang={ lang }>{ data }</CodeBlock>
			}
		</div>;
	}
}
