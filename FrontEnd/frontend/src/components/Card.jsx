import React from 'react';
import './Card.css';

const Card = ({ children, className = '', title }) => {
    return (
        <div className={`glass-panel card ${className}`}>
            {title && <h3 className="card-title">{title}</h3>}
            {children}
        </div>
    );
};

export default Card;
