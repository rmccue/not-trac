import { combineReducers } from 'redux';

import components from './components';
import prs from './prs';
import query from './query';
import tickets from './tickets';
import user from './user';

export default combineReducers({
	components,
	prs,
	query,
	tickets,
	user,
});
