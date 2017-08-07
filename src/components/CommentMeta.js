import PropTypes from 'prop-types';
import React from 'react';

import CommentHeader from './CommentHeader';
import Time from './Time';

import './CommentMeta.css';

// Hardcoded in Trac.
const CONTRIBUTOR_LABELS = {
	matt: 'Project Lead',
	markjaquith: 'Lead Developer',
	nacin: 'Lead Developer',
	azaozz: 'Lead Developer',
	dd32: 'Lead Developer',
	helen: 'Lead Developer',
	SergeyBiryukov: 'Core Committer',
	johnbillion: 'Core Committer',
	DrewAPicture: 'Core Committer',
	pento: 'Core Committer',
	boonebgorges: 'Core Committer',
	jeremyfelt: 'Core Committer',
	jorbin: 'Core Committer',
	nbachiyski: 'Core Committer',
	wonderboymusic: 'Core Committer',
	westonruter: 'Core Committer',
	iseulde: 'Core Committer',
	afercia: 'Core Committer',
	swissspidy: 'Core Committer',
	rachelbaker: 'Core Committer',
	mikeschroder: 'Core Committer',
	joemcgill: 'Core Committer',
	ocean90: 'Core Committer',
	aaroncampbell: 'Core Committer',
	kovshenin: 'Core Committer',
	obenland: 'Core Committer',
	rmccue: 'Core Committer',
	michaelarestad: 'Core Committer',
	joehoyle: 'Core Committer',
	melchoyce: 'Core Committer',
	ericlewis: 'Core Committer',
	peterwilsoncc: 'Core Committer',
	jnylen0: 'Core Committer',
	adamsilverstein: 'Core Committer',
	flixos90: 'Core Committer',
	matveb: 'Core Committer',
	joen: 'Core Committer',
	kadamwhite: 'Core Committer',
	iandunn: 'Core Committer',
	iammattthomas: 'Core Committer',
	lancewillett: 'Themes Committer',
	iandstewart: 'Themes Committer',
	karmatosed: 'Themes Committer',
	davidakennedy: 'Themes Committer',
	ryan: 'Lead Tester',
	designsimply: 'Lead Tester',
	westi: 'Lead Developer',
	koop: 'Core Committer',
	duck_: 'Core Committer'
};

export default class CommentMeta extends React.PureComponent {
	render() {
		const { author, edits, number, pending, ticket, timestamp } = this.props;

		return <CommentHeader>
			<p>
				<a className="CommentMeta-author" href={ `/user/${ author }` }>
					@{ author }
				</a>
				{ ' commented ' }
				<Time timestamp={ timestamp } />
				{ edits.length > 0 ?
					<span> &bull; edited</span>
				: null }
			</p>
			<p>
				{ author in CONTRIBUTOR_LABELS ?
					<span className="CommentMeta-author-label">{ CONTRIBUTOR_LABELS[ author ] }</span>
				: null }
				{ pending ?
					<span>Saving&hellip;</span>
				:
					<span>
						<a href={ `#comment:${ number }` }>#{ number }</a>
						<span> &bull; </span>
						<a href={ `https://core.trac.wordpress.org/ticket/${ ticket }#comment:${ number }` }>
							<span className="dashicons dashicons-external"></span>
						</a>
					</span>
				}
			</p>
		</CommentHeader>;
	}
}
CommentMeta.propTypes = {
	author: PropTypes.string.isRequired,
	edits: PropTypes.array,
	number: PropTypes.number.isRequired,
	ticket: PropTypes.number.isRequired,
	timestamp: PropTypes.number.isRequired,
};
CommentMeta.defaultProps = {
	edits: [],
	pending: false,
};
