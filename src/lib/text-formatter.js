import React from 'react';
import { Link } from 'react-router-dom';

import CodeBlock from '../components/CodeBlock';

const PARA_MARKER = '__PARA_MARKER__';

const formatLeaf = leaf => {
	// Special-case.
	if ( typeof leaf === 'string' ) {
		return leaf;
	}

	switch ( leaf.type ) {
		// Headings.
		case 'heading': {
			const { level, text } = leaf;
			const el = 'h' + level;

			return React.createElement( el, {}, [ text ] );
		}

		// Lists.
		case 'unordered-list': {
			return <ul>{ leaf.children.map( item => <li>{ formatTree( item ) }</li> ) }</ul>;
		}
		case 'ordered-list': {
			return <ol start={ leaf.number }>
				{ leaf.children.map( item => <li>{ formatTree( item ) }</li> ) }
			</ol>;
		}

		case 'citation':
			return <blockquote>{ formatTree( leaf.children ) }</blockquote>;

		// Code.
		case 'preformatted':
			return <CodeBlock lang={ leaf.language }>{ leaf.text }</CodeBlock>;

		// Basic text formatting.
		case 'bold':
			return <strong>{ formatTree( leaf.children, true ) }</strong>;

		case 'italic':
			return <em>{ formatTree( leaf.children, true ) }</em>;

		case 'strike':
			return <strike>{ formatTree( leaf.children, true ) }</strike>;

		case 'code':
			return <code>{ leaf.text }</code>;

		case 'horizontal-line':
			return <hr />;

		case 'break':
			return <br />;

		// Links.
		case 'link':
			return <a href={ leaf.url }>{ formatTree( leaf.children || leaf.text, true ) }</a>;

		// Cross-referencing.
		case 'ticket': {
			const { id } = leaf;

			return <Link to={ `/ticket/${id}` }>#{ id }</Link>;
		}
		case 'mention': {
			const id = leaf.text;

			return <a href={ `/user/${id}` }>@{ id }</a>;
		}

		// Paragraph separator.
		case 'para':
			return PARA_MARKER;

		// Default text.
		case 'text':
			return leaf.text;

		default:
			return <span>Unknown type { leaf.type }</span>
	}
};

const formatTree = ( tree, inline = false ) => {
	// Special-case.
	if ( typeof tree === 'string' ) {
		return tree;
	}

	const leaves = tree.map( formatLeaf );
	if ( inline ) {
		return leaves;
	}

	// Chunk based on paragraph markers.
	const chunks = [];
	let current = [];
	while ( leaves.length > 0 ) {
		const leaf = leaves.pop();
		if ( leaf !== PARA_MARKER ) {
			current.push( leaf );
			continue;
		}

		chunks.push( current.reverse() );
		current = [];
	}
	if ( current.length ) {
		chunks.push( current.reverse() );
	}

	// Convert to paragraphs.
	return chunks.reverse().map( chunk => {
		if ( chunk.length === 1 && typeof chunk !== 'string' ) {
			// return chunk;
		}

		return <p>{ chunk }</p>;
	});
};

export default formatTree;
