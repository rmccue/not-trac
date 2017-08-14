import qs from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { set_user_credentials } from './actions';
import Avatar from './components/Avatar';
import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/Login';

import Attachment from './containers/Attachment';
import Query from './containers/Query';
import Summary from './containers/Summary';
import Ticket from './containers/Ticket';

import './App.css';

class App extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			user: null,
		};
	}

	componentWillMount() {
		// TEMPORARY!
		const existing = localStorage.getItem( 'trac-auth' );
		if ( existing ) {
			this.props.dispatch( set_user_credentials( JSON.parse( existing ) ) );
		}
	}

	render() {
		const { dispatch, user } = this.props;

		if ( ! user.username ) {
			return <Router>
				<div className="App">
					<Header
						title="Not Trac"
					/>
					<div className="wrapper">
						<Login
							onSubmit={ user => dispatch( set_user_credentials( user ) ) }
						/>
					</div>
					<Footer />
				</div>
			</Router>;
		}

		return <Router>
			<div className="App">
				<Header
					title="Not Trac"
					user={ user }
				>
					{ user ?
						<ul>
							<li>
								<Link to="/">Components</Link>
							</li>
							<li>
								<Avatar size={ 24 } user={ user.username } />
								@{ user.username }
							</li>
						</ul>
					: null }
				</Header>
				<div className="wrapper">
					<Switch>
						<Route
							exact
							path="/"
							component={ Summary }
						/>
						<Route
							exact
							path="/query"
							component={ ({ location }) => (
								<Query
									params={ qs.parse( location.search ) }
								/>
							)}
						/>
						<Route
							exact
							path="/test"
							component={ ({ location }) => {
								console.log( qs.parse( location.search ) );
								return <span>Testing!</span>
							}}
						/>
						<Route
							exact
							path="/component/:name"
							render={ ({ match }) => (
								<Redirect
									to={{
										pathname: '/query',
										search: '?' + qs.stringify({
											component: match.params.name
										})
									}}
								/>
							)}
						/>
						<Route
							exact
							path="/ticket/:id"
							render={ ({ match }) => <Ticket id={ match.params.id } /> }
						/>
						<Route
							exact
							path="/attachment/ticket/:ticket/:id"
							component={ ({ match }) => (
								<Attachment
									id={ match.params.id }
									ticket={ match.params.ticket }
								/>
							)}
						/>
					</Switch>
				</div>
				<Footer />
			</div>
		</Router>;
	}
}

export default connect(
	({ user }) => ({ user })
)( App );
