import PropTypes from 'prop-types';
import React from 'react';

import './Button.css';

const Button = ({ children, primary, submit, onClick }) => {
	const className = primary ? "Button primary" : "Button";

	return <button
		children={ children }
		className={ className }
		type={ submit ? "submit" : "button" }
		onClick={ onClick ? onClick : null }
	/>;
}

Button.propTypes = {
	primary: PropTypes.bool,
	submit: PropTypes.bool,
	onClick: PropTypes.func,
};

Button.defaultProps = {
	primary: false,
	submit: false,
};

export default Button;
