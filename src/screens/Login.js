import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
                setIsLoggedIn(true); 
                navigate('/');
            } 
        }catch (err) {
                setMessage('An error occurred');
                console.error(err);
        }
    };

    return (
        <div className="login-page">
            <Link to="/">Back</Link>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                {message && <p>{message}</p>}
            </form>
            <p>
                Don’t have an account? <Link to="/signup">Signup</Link>
            </p>
        </div>
    );
};

export default Login;