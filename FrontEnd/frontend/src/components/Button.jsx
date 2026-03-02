import React from 'react';
import './Button.css';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    return (
        <button
            className={`custom-btn btn-${variant} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
