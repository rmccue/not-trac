import React from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { set_components, set_ticket_data } from '../actions';
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
		});
	}

	render() {
		const { components } = this.props;
		const { currentComponent, loading } = this.state;

		if ( loading ) {
			return <Loading />;
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
