import { PUSH_ATTACHMENT, PUSH_TICKET_CHANGE, SET_TICKET_ATTACHMENTS, SET_TICKET_CHANGES, SET_TICKET_DATA } from '../actions';

export default function tickets( state = {}, action ) {
	switch ( action.type ) {
		case PUSH_ATTACHMENT: {
			const ticket = state[ action.id ] || {};
			const attachments = ticket.attachments || {};

			return {
				...state,
				[ action.id ]: {
					...ticket,
					attachments: {
						...attachments,
						[ action.attachment.id ]: action.attachment,
					},
				},
			};
		}

		case PUSH_TICKET_CHANGE: {
			const ticket = state[ action.id ] || {};
			const changes = ticket.changes || [];

			return {
				...state,
				[ action.id ]: {
					...ticket,
					changes: [
						...changes,
						action.change,
					],
				},
			};
		}

		case SET_TICKET_ATTACHMENTS: {
			const ticket = state[ action.id ] || {};
			return {
				...state,
				[ action.id ]: {
					...ticket,
					attachments: action.attachments,
				}
			}
		}

		case SET_TICKET_CHANGES: {
			const ticket = state[ action.id ] || {};
			return {
				...state,
				[ action.id ]: {
					...ticket,
					changes: action.changes,
				},
			};
		}

		case SET_TICKET_DATA: {
			const ticket = state[ action.id ] || {};
			return {
				...state,
				[ action.id ]: {
					...ticket,
					...action.data
				},
			};
		}

		default:
			return state;
	}
}
