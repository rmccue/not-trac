import React from 'react';
import DocumentTitle from 'react-document-title';

export default ({ children, error, title }) => <DocumentTitle title='Error'>
	<div className="Error">
		<h2>{ title }</h2>
		{ children }

		<details>
			<summary>Error details</summary>
			<dl>
				<dt>Type</dt>
				<dd><code>{ error.name }</code></dd>
				<dt>Message</dt>
				<dd>{ error.message }</dd>
				<dt>Trace</dt>
				<dd>{ error.stack }</dd>
			</dl>
		</details>
	</div>
</DocumentTitle>;
