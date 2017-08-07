import React from 'react';

import Button from './Button';

import './AttachmentUpload.css';

export default class AttachmentUpload extends React.PureComponent {
	render() {
		return <div className="AttachmentUpload">
			<p>
				<Button>Upload an Attachment</Button>
				<Button>Attach a Pull Request</Button>
			</p>
		</div>;
	}
}
