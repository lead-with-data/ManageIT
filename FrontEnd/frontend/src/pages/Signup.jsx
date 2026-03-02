import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../api';

const Signup = ({ onSignup, onGoToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // Check if user already exists
            const existingRes = await api.get('/accounts/users/');
            const userExists = existingRes.data.find(u => u.email === email);

            if (userExists) {
                setError('A user with that email already exists.');
                return;
            }

            // Create new user
            const res = await api.post('/accounts/users/', {
                name,
                email,
                password
            });

            if (res.status === 201) {
                onSignup(res.data);
            } else {
                setError('Failed to create account.');
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                // If it's a Django validation error (often an object or array)
                const errorMsg = typeof err.response.data === 'object'
                    ? JSON.stringify(err.response.data)
                    : String(err.response.data);
                setError(`Server Error: ${errorMsg}`);
            } else {
                setError(`Error: ${err.message}`);
            }
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
            <Card title="Create an Account" className="w-full max-w-md" style={{ width: '400px' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Join ManageIT to manage your projects and teams.
                </p>

                {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSignup}>
                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
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
                        Sign Up
                    </Button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Already have an account?{' '}
                    <span
                        onClick={onGoToLogin}
                        style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '500' }}
                    >
                        Sign in
                    </span>
                </div>
            </Card>
        </div>
    );
};

export default Signup;
