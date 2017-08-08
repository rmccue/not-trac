import PropTypes from 'prop-types';
import React from 'react';

import './Button.css';

const Button = ({ children, fake, primary, submit, onClick }) => {
	const className = primary ? "Button primary" : "Button";

	if ( fake ) {
		return <span
			children={ children }
			className={ className }
			onClick={ onClick }
		/>;
	}

	return <button
		children={ children }
		className={ className }
		type={ submit ? "submit" : "button" }
		onClick={ onClick ? onClick : null }
	/>;
}

Button.propTypes = {
	fake: PropTypes.bool,
	primary: PropTypes.bool,
	submit: PropTypes.bool,
	onClick: PropTypes.func,
};

Button.defaultProps = {
	fake: false,
	primary: false,
	submit: false,
};

export default Button;
