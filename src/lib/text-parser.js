import Parser from 'simple-text-parser';

const configure = parser => {
	const simple   = type => (_, text) => ({ type, text });
	const recursed = type => (_, text) => ({ type, text, children: parser.toTree( text ) });

	// Headings.
	parser.addRule( /^(={1,6})(.+?)(=*)$/gm, (_, heading, text) => {
		return {
			type: 'heading',
			level: heading.length,
			text
		};
	});

	// Lists.
	parser.addRule( /^[*-] (.+(\n {2}.+)*)/gm, (_, text) => {
		const strippedText = text.replace( '\n  ', ' ' );
		return {
			type: 'unordered-list',
			text: strippedText,
			children: parser.toTree( text ),
		}
	});
	parser.addRule( /^(\d+)\. (.+(\n {2}.+)*)/gm, (_, number, text) => {
		const strippedText = text.replace( '\n  ', ' ' );
		return {
			type: 'ordered-list',
			text: strippedText,
			number,
			children: parser.toTree( text ),
		}
	});

	// Quotes.
	parser.addRule( /((^>+.+\n)+)/m, (_, text) => {
		// Strip leading > and maybe one space from each line.
		const content = text.split( '\n' )
			.map( line => line.substr( 1 ) )
			.map( line => line[0] === ' ' ? line.substr( 1 ) : line );

		return {
			type: 'citation',
			text: text,
			children: parser.toTree( content.join( '\n' ) ),
		};
	});

	// Code.
	parser.addRule( /\{\{\{\s*(?:#!(\w+\n))?((.|\n)+?)\}\}\}/, (_, language, text) => {
		if ( text.indexOf( '\n' ) >= 0 ) {
			return { type: 'preformatted', text, language };
		}

		return { type: 'code', text };
	});

	// Basic text formatting.
	parser.addRule( /'''(.+?)'''/g,        recursed( 'bold' ) );
	parser.addRule( /\*\*(.+?)\*\*/g,      recursed( 'bold' ) );
	parser.addRule( /''(.+?)''/g,          recursed( 'italic' ) );
	parser.addRule( /~~(.+?)~~/g,          recursed( 'strike' ) );
	parser.addRule( /`(.+?)`/g,            simple( 'code' ) );
	parser.addRule( /-{4,}/g,              simple( 'horizontal-line' ) );
	parser.addRule( /(\[\[br\]\]|\\\\)/gi, simple( 'break' ) );

	// WikiCreole-style italic. Also matches URLs, so skip for now.
	// parser.addRule( /\/\/(.+?)\/\//g, simple( 'italic' ) );

	// Links.
	parser.addRule( /\[(\S+) ([^\]]+)]/, (_, url, text) => {
		return {
			type: 'link',
			url,
			text: parser.toTree( text ),
		};
	});
	parser.addRule( /\b(https?:\/\/\S+)\b/, (_, url) => {
		return {
			type: 'link',
			url,
			text: url
		}
	});

	// Cross-referencing.
	parser.addRule( /#(\d+)/g, (text, id) => ({ type: 'ticket', text, id }) );
	parser.addRule( /@(.+?)\b/g, simple( 'mention' ) );

	// Paragraph separator.
	parser.addRule( /\n\n/g, () => ({ type: 'para' }) );
};

export default text => {
	const parser = new Parser();

	configure( parser );

	return parser.toTree( text );
};
