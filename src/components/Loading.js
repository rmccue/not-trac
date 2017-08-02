import React from 'react';
import DocumentTitle from 'react-document-title';

import './Loading.css';

export default () => (
	<DocumentTitle title="Loading...">
		<div className="Loading">
			<p className="Loading-text">
				<span className="dashicons dashicons-update"></span>
				Loading&hellip;
			</p>
		</div>
	</DocumentTitle>
);
