import React from 'react';
import './Input.css';

const Input = ({ label, id, ...props }) => {
    return (
        <div className="input-group">
            {label && <label htmlFor={id} className="input-label">{label}</label>}
            <input id={id} className="custom-input glass-panel" {...props} />
        </div>
    );
};

export default Input;
