import React from 'react';

import './Footer.css';

export default () => <div className="Footer">
	<div className="wrapper">
		<div>
			<h4>Not Trac</h4>
			<p>Made just for you with &hearts; by <a href="https://rmccue.io/">Ryan McCue</a></p>
			<h4>Security</h4>
			<p>Accessing Trac requires your username/password. I promise it is
				never stored anywhere, but you still shouldn't trust me
				(especially if you have commit access).</p>
			<p><a href="https://github.com/rmccue/not-trac">Run this
				locally</a> instead.</p>
		</div>
		<div>
			<h4>Why?</h4>
			<p>Trac is kinda painful to work with day-to-day. I made this to
				make my day a little better.</p>
			<p>Hopefully, it makes your day a little better too.</p>
		</div>
		<div>
			<h4>Links</h4>
			<ul>
				<li><a href="https://github.com/rmccue/not-trac">Source on GitHub</a></li>
			</ul>
		</div>
	</div>
</div>;
