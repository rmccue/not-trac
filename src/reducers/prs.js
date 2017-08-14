import { RECEIVE_PRS, REQUEST_PRS } from '../actions';

export default function prs( state = {}, action ) {
	switch ( action.type ) {
		case REQUEST_PRS:
			return {
				...state,
				status: 'loading',
			};

		case RECEIVE_PRS:
			return {
				...state,
				status: 'loaded',
				items: [ ...action.prs ]
			};

		default:
			return state;
	}
}
