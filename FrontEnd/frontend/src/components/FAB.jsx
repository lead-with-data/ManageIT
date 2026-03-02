import React, { useState } from 'react';
import './FAB.css';

const FAB = ({ onAction, hasTeam }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleAction = (action) => {
        onAction(action);
        setIsOpen(false);
    };

    return (
        <div className="fab-container">
            {isOpen && (
                <div className="fab-menu animate-fade-in-up">
                    <button className="fab-item" onClick={() => handleAction('task')}>
                        <span className="fab-icon">+</span> Task
                    </button>
                    <button className="fab-item" onClick={() => handleAction('sprint')}>
                        <span className="fab-icon">+</span> Sprint
                    </button>
                    <button className="fab-item" onClick={() => handleAction('project')}>
                        <span className="fab-icon">+</span> Project
                    </button>
                    {!hasTeam && (
                        <button className="fab-item" onClick={() => handleAction('team')}>
                            <span className="fab-icon">+</span> Team
                        </button>
                    )}
                </div>
            )}
            <button className={`fab-main ${isOpen ? 'open' : ''}`} onClick={toggleOpen}>
                <span className="fab-icon">+</span>
            </button>
        </div>
    );
};

export default FAB;
