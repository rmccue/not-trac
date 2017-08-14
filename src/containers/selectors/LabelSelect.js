import React from 'react';

import DropSelect from '../../components/DropSelect';
import Tag from '../../components/Tag';

const CORE_LABELS = {
	'has-patch' : 'Proposed solution attached and ready for review.',
	'needs-patch' : 'Ticket needs a new patch.',
	'needs-refresh' : 'Patch no longer applies cleanly and needs to be updated.',
	'reporter-feedback' : 'Feedback is needed from the reporter.',
	'dev-feedback' : 'Feedback is needed from a core developer.',
	'2nd-opinion' : 'A second opinion is desired for the problem or solution.',
	'close' : 'The ticket is a candidate for closure.',
	'needs-testing' : 'Patch has a particular need for testing.',
	'ui-feedback' : 'Feedback is needed from the user interface perspective, generally from the UI team.',
	'ux-feedback' : 'Feedback is needed from the user experience perspective, generally from a UX lead.',
	'has-unit-tests' : 'Proposed solution has unit test coverage.',
	'needs-unit-tests' : 'Ticket has a particular need for unit tests.',
	'needs-docs' : 'Inline documentation is needed.',
	'needs-codex' : 'The Codex needs to be updated or expanded.',
	'has-screenshots' : 'Visual changes are documented with screenshots.',
	'needs-screenshots' : 'Screenshots are needed as a visual change log.',
	'commit' : 'Patch is a suggested commit candidate.',
	'early' : 'Ticket should be addressed early in the next dev cycle.',
	'i18n-change' : 'A string change, used only after string freeze.',
	'good-first-bug': 'This ticket is great for a new contributor to work on, generally because it is easy or well-contained.',
	'fixed-major': 'The commits of this ticket need to be backported.'
};

const ITEMS = Object.keys( CORE_LABELS ).map( label => {
	return {
		id: label,
		title: <Tag name={ label } />,
		value: label,
	};
});
ITEMS.unshift({
	id: '',
	title: 'None',
	value: null,
});

export default ({ label, params, onSelect }) => {
	let keywords;
	if ( params.keywords && Array.isArray( params.keywords ) ) {
		keywords = params.keywords.map( k => k.replace( '~', '' ) );
	} else if ( params.keywords ) {
		keywords = [ params.keywords.replace( '~', '' ) ];
	} else {
		keywords = [];
	}

	const onAdd = value => {
		if ( value === null ) {
			onSelect({
				keywords: undefined,
			});
			return;
		}

		// Add to list.
		onSelect({
			keywords: [ ...keywords, value ].map( v => "~" + v ),
		});
	};
	const onRemove = value => {
		const nextKeywords = keywords.filter( v => v !== value );
		if ( nextKeywords.length === 0 ) {
			onSelect({
				keywords: undefined,
			});
			return;
		}

		onSelect({
			keywords: nextKeywords.map( v => "~" + v ),
		});
	};

	return <DropSelect
		items={ ITEMS }
		label={ label }
		selected={ keywords }
		onSelect={ onAdd }
		onDeselect={ onRemove }
	/>;
};
