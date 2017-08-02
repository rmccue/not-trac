import { SET_USER_CREDENTIALS } from '../actions';

export default function user( state = {}, action ) {
	switch ( action.type ) {
		case SET_USER_CREDENTIALS:
			return {
				...state,
				...action.user
			};

		default:
			return state;
	}
}
