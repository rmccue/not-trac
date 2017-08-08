import React from 'react';

import Button from './Button';

import './AttachmentUpload.css';

export default class AttachmentUpload extends React.PureComponent {
	render() {
		return <div className="AttachmentUpload">
			<p className="buttons">
				<label className="AttachmentUpload-uploader">
					<input
						type="file"
						onChange={ e => this.setState({ file: e.target.files[0] }) }
					/>
					<Button fake>Upload an Attachment</Button>
				</label>
				<Button>Attach a Pull Request</Button>
			</p>
		</div>;
	}
}
