import { RESET_USER_CREDENTIALS, SET_USER_CREDENTIALS } from '../actions';

export default function user( state = {}, action ) {
	switch ( action.type ) {
		case RESET_USER_CREDENTIALS:
			return {};

		case SET_USER_CREDENTIALS:
			return {
				...state,
				...action.user
			};

		default:
			return state;
	}
}
