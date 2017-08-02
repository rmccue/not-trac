import { combineReducers } from 'redux';

import components from './components';
import query from './query';
import tickets from './tickets';
import user from './user';

export default combineReducers({
	components,
	query,
	tickets,
	user,
});
