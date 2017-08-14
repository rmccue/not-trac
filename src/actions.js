export const PUSH_ATTACHMENT = 'PUSH_ATTACHMENT';
export const PUSH_TICKET_CHANGE = 'PUSH_TICKET_CHANGE';
export const RECEIVE_PRS = 'RECEIVE_PRS';
export const REQUEST_PRS = 'REQUEST_PRS';
export const SET_COMPONENTS = 'SET_COMPONENTS';
export const SET_QUERY_PARAMS = 'SET_QUERY_PARAMS';
export const SET_QUERY_RESULTS = 'SET_QUERY_RESULTS';
export const SET_TICKET_ATTACHMENTS = 'SET_TICKET_ATTACHMENTS';
export const SET_TICKET_CHANGES = 'SET_TICKET_CHANGES';
export const SET_TICKET_DATA = 'SET_TICKET_DATA';
export const SET_USER_CREDENTIALS = 'SET_USER_CREDENTIALS';

export function push_attachment( id, attachment ) {
	return { type: PUSH_ATTACHMENT, id, attachment };
}

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

export function set_ticket_attachments( id, attachments ) {
	return { type: SET_TICKET_ATTACHMENTS, id, attachments };
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

export function update_prs() {
	return (dispatch, getStore) => {
		dispatch( { type: REQUEST_PRS } );

		fetch( 'https://api.github.com/repos/WordPress/wordpress-develop/pulls?state=all' )
			.then( resp => resp.json() )
			.then( data => {
				dispatch({
					type: RECEIVE_PRS,
					prs: data,
				});
			});
	}
}
