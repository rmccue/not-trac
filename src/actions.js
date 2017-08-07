export const PUSH_TICKET_CHANGE = 'PUSH_TICKET_CHANGE';
export const SET_COMPONENTS = 'SET_COMPONENTS';
export const SET_QUERY_PARAMS = 'SET_QUERY_PARAMS';
export const SET_QUERY_RESULTS = 'SET_QUERY_RESULTS';
export const SET_TICKET_CHANGES = 'SET_TICKET_CHANGES';
export const SET_TICKET_DATA = 'SET_TICKET_DATA';
export const SET_USER_CREDENTIALS = 'SET_USER_CREDENTIALS';

export function push_ticket_change( id, change ) {
	return { type: PUSH_TICKET_CHANGE, id, change };
}

export function set_components( components ) {
	return { type: SET_COMPONENTS, components };
}

export function set_query_params( params ) {
	return { type: SET_QUERY_PARAMS, params };
}

export function set_query_results( results ) {
	return { type: SET_QUERY_RESULTS, results };
}

export function set_ticket_changes( id, changes ) {
	return { type: SET_TICKET_CHANGES, id, changes };
}

export function set_ticket_data( id, data ) {
	return { type: SET_TICKET_DATA, id, data };
}

export function set_user_credentials( user ) {
	return { type: SET_USER_CREDENTIALS, user };
}
