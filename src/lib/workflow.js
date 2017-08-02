export const getKeywords = ticket => {
	const keywords = ticket.attributes.keywords.split( ' ' );

	// Remove workflow keywords.
	return keywords.filter( keyword => {
		if ( keyword === 'has-patch' || keyword === 'needs-testing' ) {
			return false;
		}

		return true;
	});
};

export const getTicketType = ticket => {
	switch ( ticket.attributes.type ) {
		case 'defect (bug)':
			return 'bug';

		case 'enhancement':
		case 'feature request':
			return 'enhancement';

		case 'task (blessed)':
			return 'task';

		default:
			return ticket.attributes.type;
	}
};

export const parseTicketResponse = data => {
	const [ id, time_created, time_changed, attributes ] = data;
	return {
		id,
		time_created,
		time_changed,
		attributes
	};
};
