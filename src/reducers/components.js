import { SET_COMPONENTS } from '../actions';

export default function components( state = {}, action ) {
	switch ( action.type ) {
		case SET_COMPONENTS:
			return { ...action.components };

		default:
			return state;
	}
}
