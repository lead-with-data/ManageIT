import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../api';

const Login = ({ onLogin, onGoToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // In a real app we'd verify via an auth endpoint
            // For this beginner project, we'll just check if the user exists
            const res = await api.get('/accounts/users/');
            const user = res.data.find(u => u.email === email && u.password === password);

            if (user) {
                onLogin(user);
            } else {
                setError('Invalid credentials or user not found');
            }
        } catch (err) {
            setError('Server error during login');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100%'
        }} className="animate-fade-in">
            <Card title="Welcome to ManageIT" className="w-full max-w-md" style={{ width: '400px' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Sign in to access your projects and teams.
                </p>

                {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
                        Sign In
                    </Button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Don't have an account?{' '}
                    <span
                        onClick={onGoToSignup}
                        style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '500' }}
                    >
                        Sign up
                    </span>
                </div>
            </Card>
        </div>
    );
};

export default Login;
