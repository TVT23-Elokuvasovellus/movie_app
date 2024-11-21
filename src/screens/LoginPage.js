import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Authentication.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', { email, password });
            setMessage(response.data.message);
            if (response.data.success) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('email', response.data.email);
                setIsLoggedIn(true); 
                navigate('/');
            } 
        } catch (err) {
            setMessage('An error occurred');
            console.error(err);
        }
    };

    return (
        <div>
            <Navbar isLoggedIn={isLoggedIn} />
            <div className="container container-custom">
                <Link to="/" className="btn btn-secondary mb-3">Back</Link>
                <div className="card card-custom">
                    <h1 className="mb-4">Login</h1>
                    <form onSubmit={handleLogin}>
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
                        <button type="submit" className="btn btn-primary btn-block input-field">Login</button>
                        {message && <p className="mt-3">{message}</p>}
                    </form>
                    <p className="mt-3">
                        Don’t have an account? <Link to="/signup">Signup</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
