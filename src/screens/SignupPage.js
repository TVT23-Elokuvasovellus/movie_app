import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Authentication.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/signup', { email, password });
            setMessage(response.data.message);
        } catch (err) {
            setMessage('An error occurred');
            console.error(err);
        }
    };

    return (
        <div>
            <Navbar isLoggedIn={false} />
            <div className="container container-custom">
                <Link to="/" className="btn btn-secondary mb-3">Back</Link>
                <div className="card card-custom">
                    <h1 className="mb-4">Signup</h1>
                    <form onSubmit={handleSignup}>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control input-field"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control input-field"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block input-field">Signup</button>
                        {message && <p className="mt-3">{message}</p>}
                    </form>
                    <p className="mt-3">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
