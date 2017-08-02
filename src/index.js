import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './App';
import reducer from './reducers';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

// Prepare initial state for the store.
const initialState = {
	query: {
		params: {},
		results: [],
	},
	tickets: {},
	user: {},
};
const existing = localStorage.getItem( 'trac-auth' );
if ( existing ) {
	initialState.user = JSON.parse( existing );
}

// Actually create the store.
const store = createStore( reducer, initialState );

// Now, render.
const render = App => {
	ReactDOM.render(
		<Provider store={ store }>
			<App />
		</Provider>,
		document.getElementById( 'root' )
	);
};
render( App );

// Register hot-reloading.
if ( module.hot ) {
	module.hot.accept( './App', () => {
		import( './App' )
			.then( NextApp => render( NextApp.default ) );
	});
}

registerServiceWorker();
