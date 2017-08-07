import React from 'react';

import Button from './Button';
import Comment from './Comment';
import CommentContent from './CommentContent';
import CommentHeader from './CommentHeader';

import './CommentEditor.css';

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

		console.log( this.state.content );
	}

	render() {
		const { user } = this.props;
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
						<p>
							{ /* Formatters */ }
						</p>
					: null }
				</CommentHeader>

				{ mode === 'preview' ? (
					<CommentContent
						text={ this.state.content || "''Nothing to preview''" }
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
						<Button submit>Comment</Button>
						<Button primary submit>Comment</Button>
					</span>
				</p>
			</form>
		</Comment>;
	}
}
