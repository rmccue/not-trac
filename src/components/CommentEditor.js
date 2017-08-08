import React from 'react';

import Button from './Button';
import Comment from './Comment';
import CommentContent from './CommentContent';
import CommentHeader from './CommentHeader';

import './CommentEditor.css';

const apply = ( selection, start, end ) => {
	return selection.length ? start + selection + end : start;
};

const BUTTONS = {
	bold: {
		icon: 'editor-bold',
		title: 'Add bold text',
		apply: text => apply( text, "'''", "'''" ),
	},
	italic: {
		icon: 'editor-italic',
		title: 'Add italic text',
		apply: text => apply( text, "''", "''" ),
	},
	sep1: { separator: true },
	quote: {
		icon: 'editor-quote',
		title: 'Add blockquote',
		apply: text => apply( text, '>', '\n' ),
	},
	code: {
		icon: 'editor-code',
		title: 'Add code',
		apply: text => text.indexOf( '\n' ) > 0 ? apply( text, '```\n', '\n```\n' ) : apply( text, '`', '`' ),
	},
};

export default class CommentEditor extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			content: '',
			height: null,
			mode: 'edit',
		};
		this.textarea = null;
	}

	componentDidUpdate() {
		if ( ! this.textarea ) {
			return;
		}

		// Recalculate height of the textarea, and grow to match content.
		const height = this.textarea.offsetHeight;
		const desired = this.textarea.scrollHeight;

		if ( desired > height ) {
			this.setState({ height: desired });
		}
	}

	onSubmit( e ) {
		e.preventDefault();

		this.props.onSubmit( this.state.content );
	}

	onButton( e, apply ) {
		e.preventDefault();

		const { selectionStart, selectionEnd } = this.textarea;
		const content = this.state.content;

		const nextParts = [
			content.substring( 0, selectionStart ),
			apply( content.substring( selectionStart, selectionEnd ) ),
			content.substring( selectionEnd )
		];

		this.setState({ content: nextParts.join( '' ) });
	}

	render() {
		const { ticket, user } = this.props;
		const { content, height, mode } = this.state;

		return <Comment author={ user.username } className="CommentEditor">
			<form onSubmit={ e => this.onSubmit( e ) }>
				<CommentHeader>
					<ul className="CommentEditor-tabs">
						<li>
							<label>
								<input
									checked={ mode === 'edit' }
									name="CommentEditor-mode"
									type="radio"
									value="edit"
									onChange={ e => this.setState({ mode: e.target.value }) }
								/>
								<span>Write</span>
							</label>
						</li>
						<li>
							<label>
								<input
									checked={ mode === 'preview' }
									name="CommentEditor-mode"
									type="radio"
									value="preview"
									onChange={ e => this.setState({ mode: e.target.value }) }
								/>
								<span>Preview</span>
							</label>
						</li>
					</ul>
					{ mode === 'edit' ?
						<ul className="CommentEditor-toolbar">
							{ Object.keys( BUTTONS ).map( type => {
								if ( BUTTONS[ type ].separator ) {
									return <span key={ type } className="separator" />;
								}

								return <button
									key={ type }
									onClick={ e => this.onButton( e, BUTTONS[ type ].apply ) }
									title={ BUTTONS[ type ].title }
									type="button"
								>
									<span className={`dashicons dashicons-${ BUTTONS[ type ].icon }`} />
								</button>;
							} ) }
						</ul>
					: null }
				</CommentHeader>

				{ mode === 'preview' ? (
					<CommentContent
						text={ this.state.content || "''Nothing to preview''" }
						ticket={ ticket }
					/>
				) : (
					<textarea
						ref={ el => this.textarea = el }
						className="CommentEditor-editor"
						placeholder="Write a comment..."
						style={{ height }}
						value={ content }
						onChange={ e => this.setState({ content: e.target.value }) }
					/>
				) }

				<p className="CommentEditor-submit">
					<small>
						<a
							href="https://core.trac.wordpress.org/wiki/WikiFormatting"
							rel="noopener noreferrer"
							target="_blank"
						>Format with WikiFormatting</a>
					</small>
					<span className="CommentEditor-submit-buttons">
						<Button primary submit>Comment</Button>
					</span>
				</p>
			</form>
		</Comment>;
	}
}
