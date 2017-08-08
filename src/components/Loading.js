import React from 'react';
import DocumentTitle from 'react-document-title';

import Spinner from './Spinner';

import './Loading.css';

export default () => (
	<DocumentTitle title="Loading...">
		<div className="Loading">
			<p className="Loading-text">
				<Spinner />
				Loading&hellip;
			</p>
		</div>
	</DocumentTitle>
);
