import React from 'react';

import Avatar from './Avatar'
import FormattedText from './FormattedText';
import TimelineEvent from './TimelineEvent';

export default class SlackMention extends React.Component {
	render() {
		const { text } = this.props;
		const avatar = <Avatar size={ 16 } user="slackbot" />
		return <TimelineEvent compact icon={ avatar }>
			<FormattedText text={ text } />
		</TimelineEvent>;
	}
}
