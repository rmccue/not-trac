import PropTypes from 'prop-types';
import React from 'react';

import './Button.css';

const Button = ({ children, disabled, fake, primary, submit, onClick }) => {
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
		disabled={ disabled }
		type={ submit ? "submit" : "button" }
		onClick={ onClick ? onClick : null }
	/>;
}

Button.propTypes = {
	disabled: PropTypes.bool,
	fake: PropTypes.bool,
	primary: PropTypes.bool,
	submit: PropTypes.bool,
	onClick: PropTypes.func,
};

Button.defaultProps = {
	disabled: false,
	fake: false,
	primary: false,
	submit: false,
};

export default Button;
