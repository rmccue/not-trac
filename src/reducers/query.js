import { SET_QUERY_PARAMS, SET_QUERY_RESULTS } from '../actions';

export default function query( state = {}, action ) {
	switch ( action.type ) {
		case SET_QUERY_PARAMS:
			return {
				...state,
				params: action.params,
				results: [],
			};

		case SET_QUERY_RESULTS:
			return {
				...state,
				results: action.results,
			};

		default:
			return state;
	}
}
