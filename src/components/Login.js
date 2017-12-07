import React from 'react';

import './Login.css';

export default class Login extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			username: '',
			password: '',
			remember: false,
		};
	}

	onSubmit( e ) {
		const { password, remember, username } = this.state;

		e.preventDefault();

		this.props.onSubmit( { username, password }, remember );
	}

	render() {
		return <div className="Login">
			<h1>Log In to WordPress.org</h1>
			<p>Unfortunately, Trac only provides access to authenticated users.
				To access Trac, I need your username and password. This is never
				stored or sent anywhere, and is only ever sent to the Trac API.</p>

			<p>Due to browser restrictions, Trac requests are passed via a small
				proxy server. If this makes you nervous (and it should), you
				should run this locally instead.</p>

			<form onSubmit={ e => this.onSubmit( e ) }>
				<div>
					<label>Username</label>
					<input
						type="text"
						placeholder="nacin"
						onChange={ e => this.setState({ username: e.target.value }) }
					/>
				</div>
				<div>
					<label>Password</label>
					<input
						type="password"
						onChange={ e => this.setState({ password: e.target.value }) }
					/>
				</div>
				<div>
					<label>Remember Me</label>
					<input
						type="checkbox"
						value={ this.state.remember }
						onChange={ e => this.setState( { remember: e.target.checked } ) }
					/>
				</div>

				<button>Log In</button>
			</form>
		</div>;
	}
}
