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
	const parseList = ( matcher, text ) => {
		let lines = text.split( '\n' );

		// If the first item has leading spaces, strip them from each line first.
		const leadingSpace = lines[0].match( /^\s+/ );
		if ( leadingSpace ) {
			lines = lines.map( line => {
				if ( line.substr( 0, leadingSpace[0].length ) === leadingSpace[0] ) {
					return line.substr( leadingSpace[0].length );
				}
				return line;
			});
		}

		// Split each list item into a separate "block".
		let stripChars = 0;
		const blocks = lines.reduce( ( blocks, line ) => {
			const match = line.match( matcher );
			if ( match ) {
				stripChars = match[1].length;
				blocks.push( [ line.substring( stripChars ) ] );
				return blocks;
			}

			// Strip leading, if it's whitespace.
			const stripped = line.substring( 0, stripChars ).trim().length === 0 ? line.substring( stripChars ) : line;
			blocks[ blocks.length - 1 ].push( stripped );
			return blocks;
		}, [] );
		return blocks.map( block => block.join( '\n' ) ).map( item =>  parser.toTree( item + '\n' ) );
	};

	parser.addRule( /((^ *[*-] (.+(\n {2}.+)*)(\n|$))+)/m, (_, text, ws) => {
		return {
			type: 'unordered-list',
			text,
			children: parseList( /^([*-] )/, text, ws.length ),
		}
	});
	parser.addRule( /(^ *(\d+)\. (.+(\n {2}.+)*(\n|$))+)/m, (_, text, number) => {
		return {
			type: 'ordered-list',
			text,
			number,
			children: parseList( /^(\d+\. )/, text ),
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
	parser.addRule( /\[(\S+)(?: ([^\]]+))?]/, (_, url, text) => {
		// Match internal links first.
		if ( url.match( /^\d+$/ ) ) {
			return {
				type: 'commit',
				text: text || `[${ url }]`,
				id: url,
			}
		}
		let matches = url.match( /^ticket:(\d+)$/i );
		if ( matches ) {
			return {
				type: 'ticket',
				text: text || matches[1],
				id: matches[1],
			};
		}
		matches = url.match( /^changeset:(\d+)$/i );
		if ( matches ) {
			return {
				type: 'commit',
				text: text || matches[1],
				id: matches[1],
			};
		}
		matches = url.match( /^attachment:(([^:]+)(?::ticket:(\d+))?)$/i );
		if ( matches ) {
			return {
				type: 'attachment',
				text: text || matches[1],
				id: matches[2],
				ticket: matches[3] || null,
			};
		}

		return {
			type: 'link',
			url,
			text: parser.toTree( text || url ),
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
	parser.addRule( /\battachment:([^:]+)(?::ticket:(\d+))?\b/i, (text, id, ticket) => ({ type: 'attachment', text, id, ticket }) );
	parser.addRule( /(ticket:|#)(\d+)/gm, (text, _, id) => ({ type: 'ticket', text, id }) );
	parser.addRule( /@(.+?)\b/g, simple( 'mention' ) );
	parser.addRule( /\b(?:r|changeset:)(\d+)\b/g, (text, id) => ({ type: 'commit', text, id }) );

	// Paragraph separator.
	parser.addRule( /\n\n/g, () => ({ type: 'para' }) );
};

export default text => {
	const parser = new Parser();

	configure( parser );

	return parser.toTree( text );
};
