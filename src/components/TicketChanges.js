import React from 'react';
import { Link } from 'react-router-dom';

import Comment from './Comment';
import CommentContent from './CommentContent';
import CommentMeta from './CommentMeta';
import SlackMention from './SlackMention';
import Tag from './Tag';
import Time from './Time';
import Timeline from './Timeline';
import TimelineEvent from './TimelineEvent';
import UserLink from './UserLink';

import './TicketChanges.css';

const parseChanges = changes => {
	let pending = [];

	return changes.reduce( ( next, current ) => {
		const [ timestamp, author, field, oldval, newval, permanent ] = current;
		if ( field.indexOf( '_comment' ) === 0 ) {
			pending.push({
				author,
				number: field.substring( '_comment'.length ),
				text: oldval,
				edit_ts: newval,
			});
			return next;
		}
		const change = { timestamp, author, field, oldval, newval, permanent };
		if ( field === 'comment' && pending.length > 0 ) {
			change.edits = pending;
			pending = [];
		}

		next.push( change );
		return next;
	}, [] );
};

export default class TicketChanges extends React.PureComponent {
	getChange( change ) {
		const { attachments, ticket } = this.props;
		const { timestamp, author, field, oldval, newval, permanent } = change;

		const key = timestamp + field;
		switch ( field ) {
			case 'comment':
				if ( ! permanent || newval.length <= 0 ) {
					return null;
				}

				if ( author === 'slackbot' || author === 'ircbot' ) {
					return <SlackMention text={ newval } />;
				}

				// Replies have an ID like `11.12`, so only take the last part.
				const number = oldval === '??' ? 0 : parseInt( oldval.split( '.' ).pop(), 10 );
				const pending = oldval === '??';

				return <TimelineEvent key={ key } id={ `comment:${ number }` }>
					<Comment author={ author }>
						<CommentMeta
							author={ author }
							edits={ change.edits || [] }
							number={ number }
							pending={ pending }
							ticket={ ticket }
							timestamp={ timestamp }
						/>
						<CommentContent
							text={ newval }
							ticket={ ticket }
						/>
					</Comment>
				</TimelineEvent>;

			case 'attachment': {
				const patch = newval;
				const icon = <span className="dashicons dashicons-upload"></span>;
				return <TimelineEvent key={ key } compact icon={ icon }>
					<p>
						<UserLink user={ author } />
						{ ' uploaded a patch ' }
						<Time timestamp={ timestamp } />
					</p>
					<p className="TicketChanges-attachment">
						<Link to={ `/attachment/ticket/${ ticket }/${ patch }` }>
							{ ( attachments && patch in attachments ) ?
								<span className="TicketChanges-attachment-desc">
									{ attachments[ patch ].description }
								</span>
							: null }
							<code>{ patch }</code>
						</Link>
					</p>
				</TimelineEvent>;
			}

			case 'keywords': {
				const icon = <span className="dashicons dashicons-tag"></span>;
				const [ oldTags, newTags ] = [ oldval, newval ].map( set => {
					return set
						.trim()
						.split( ' ' )
						.map( t => t.trim() )
						.filter( t => t.length > 0 );
				});

				const added = newTags.filter( tag => oldTags.indexOf( tag ) === -1 );
				const removed = oldTags.filter( tag => newTags.indexOf( tag ) === -1 );

				let addText = null;
				let removeText = null;
				let tagger = tags => tags.map( tag => <Tag key={ tag } name={ tag } /> );

				if ( added.length > 0 ) {
					addText = <span>added { tagger( added ) }</span>;
				}
				if ( removed.length > 0 ) {
					removeText = <span>removed { tagger( removed ) }</span>;
				}

				return <TimelineEvent key={ key } compact icon={ icon }>
					<UserLink user={ author } />
					{ ' ' }
					{ ( addText && removeText ) ?
						<span>{ addText } and { removeText }</span>
					: ( addText || removeText ) }
					{ ' keywords ' }
					<Time timestamp={ timestamp } />
				</TimelineEvent>
			}

			case 'owner': {
				const icon = <span className="dashicons dashicons-admin-users"></span>;

				let text;
				switch ( true ) {
					case ! oldval && newval === author:
						text = <span><UserLink user={ author } /> self-assigned this</span>;
						break;

					case oldval === author && ! newval:
						text = <span><UserLink user={ author } /> removed their assignment</span>;
						break;

					case ! newval && oldval:
						text = <span><UserLink user={ author } /> was unassigned by <UserLink user={ author } /></span>;
						break;

					case newval && ! oldval:
						text = <span><UserLink user={ newval } /> was assigned by <UserLink user={ author } /></span>;
						break;

					default:
						text = <span><UserLink user={ author } /> assigned <UserLink user={ newval } /> and unassigned <UserLink user={ oldval } /></span>;
						break;
				}

				return <TimelineEvent key={ key } compact icon={ icon }>
					{ text } <Time timestamp={ timestamp } />
				</TimelineEvent>;
			}

			default: {
				if ( field === '_comment0' ) {
					console.log( change );
				}

				let action;
				if ( ! oldval && newval ) {
					action = <span>added <code>{ newval }</code> { field }</span>;
				} else if ( ! newval && oldval ) {
					action = <span>removed <code>{ oldval }</code> { field }</span>;
				} else {
					action = <span>changed { field } from <code>{ oldval }</code> to <code>{ newval }</code></span>;
				}

				const icon = <span className="dashicons dashicons-tag"></span>;
				return <TimelineEvent key={ key } compact icon={ icon }>
					<UserLink user={ author } /> { action } <Time timestamp={ timestamp } />
				</TimelineEvent>;
			}
		}
	}

	render() {
		const { changes } = this.props;

		const elements = parseChanges( changes )
			.map( change => this.getChange( change ) )
			.filter( change => !!change );

		return <Timeline>
			{ elements }
		</Timeline>
	}
}
