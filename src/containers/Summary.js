import React from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { set_components, set_ticket_data } from '../actions';
import ErrorComponent from '../components/Error';
import Loading from '../components/Loading';
import Tag from '../components/Tag';
import TicketList from '../components/TicketList';
import Trac from '../lib/trac';
import { parseTicketResponse } from '../lib/workflow';

import './Summary.css';

class Summary extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			error: null,
			loading: true,
			components: null,
		};

		this.api = new Trac( props.user );
	}

	componentWillReceiveProps( nextProps ) {
		if ( this.props.user !== nextProps.user ) {
			this.api = new Trac( nextProps.user );
		}
	}

	componentDidMount() {
		if ( ! this.api ) {
			console.log( 'wtf' );
			console.log( this );
			return;
		}

		this.loadComponents();
	}

	loadComponents() {
		const { dispatch } = this.props;
		this.api.call( 'ticket.component.getAll' ).then( names => {
			const components = {};
			names.forEach( name => {
				components[ name ] = {
					name,
					details: null,
				};
			});

			dispatch( set_components( components ) );
			this.setState({ loading: false });
		}).catch( e => {
			this.setState({ loading: false, error: e });
		});
	}

	onTryAgain( e ) {
		e.preventDefault();

		this.setState({ loading: true, error: null });
		this.loadComponents();
	}

	render() {
		const { components } = this.props;
		const { error, loading } = this.state;

		if ( loading ) {
			return <Loading />;
		}

		if ( error ) {
			return <ErrorComponent
				error={ error }
				title="Unable to load components"
			>
				<p>An error occurred while trying to load components from Trac.</p>
				<p>If you're running this locally, ensure your Trac proxy is running.</p>
				<button
					onClick={ e => this.onTryAgain( e ) }
					type="button"
				>Try again</button>
			</ErrorComponent>;
		}

		return <DocumentTitle title="Summary">
			<div className="Summary">
				<h2>Browse by Component</h2>
				<p className="Summary-components">
					{ Object.values( components ).map( component => <span key={ component.name }>
						<Link to={ `/component/${ encodeURIComponent( component.name ) }`}>
							<Tag name={ component.name } />
						</Link>
						{/*
						<button
							onClick={ e => {
								e.preventDefault();
								this.onSelect( component );
							}}
						>
							{ component.name }
						</button>
						*/}
					</span>)}
				</p>
			</div>
		</DocumentTitle>;
	}
}

export default connect(
	({ components, user }) => ({ components, user })
)( Summary );
