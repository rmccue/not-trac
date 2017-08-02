import { SET_TICKET_CHANGES, SET_TICKET_DATA } from '../actions';

export default function tickets( state = {}, action ) {
	switch ( action.type ) {
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
