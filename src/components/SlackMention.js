import React from 'react';

import Avatar from './Avatar'
import FormattedText from './FormattedText';
import TimelineEvent from './TimelineEvent';
import slack_svg_url from '../slack.svg';

export default class SlackMention extends React.Component {
	render() {
		const { text } = this.props;
		const icon = <img
			src={ slack_svg_url }
			style={{
				height: 32,
				width: 32,
			}}
		/>
		return <TimelineEvent compact icon={ icon }>
			<FormattedText text={ text } />
		</TimelineEvent>;
	}
}
