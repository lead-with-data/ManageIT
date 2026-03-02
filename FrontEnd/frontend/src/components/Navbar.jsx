import React from 'react';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
    // Determine the user's name or fallback
    const displayName = user?.name || "User";
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h1>Manage<span className="text-accent">IT</span></h1>
            </div>
            <div className="navbar-right">
                <div className="navbar-user">
                    <div className="avatar">{initial}</div>
                    <span>{displayName}</span>
                </div>
                {onLogout && (
                    <button className="logout-btn" onClick={onLogout}>Logout</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
