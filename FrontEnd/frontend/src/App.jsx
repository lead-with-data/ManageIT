import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CanvasView from './pages/CanvasView';

function App() {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(true);

    if (!user) {
        if (showLogin) {
            return <Login onLogin={(userData) => setUser(userData)} onGoToSignup={() => setShowLogin(false)} />;
        } else {
            return <Signup onSignup={(userData) => setUser(userData)} onGoToLogin={() => setShowLogin(true)} />;
        }
    }

    return (
        <div className="app-container">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar user={user} onLogout={() => setUser(null)} />
                <main className="main-content" style={{ padding: 0 }}>
                    <CanvasView user={user} />
                </main>
            </div>
        </div>
    );
}

export default App;
