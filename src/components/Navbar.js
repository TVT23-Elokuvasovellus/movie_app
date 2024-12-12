import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Make sure this path is correct
import Notifications from './Notifications';
import '../styles/Navbar.css';

const Navbar = () => {
    const { isLoggedIn, logout } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('isDarkMode') === 'true';
    });
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
        trackNotifications();
    }, [isDarkMode]);

    useEffect(() => {
        trackNotifications();
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.body.classList.toggle('dark-mode', newMode);
        localStorage.setItem('isDarkMode', newMode);
    };
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const username = localStorage.getItem('email');
    const userId = localStorage.getItem('userId');

    const handleShowNotifications = () => setShowNotifications(true);
    const handleCloseNotifications = () => setShowNotifications(false);

    const trackNotifications = () => {
        const fetchedNotifications = [
            // Example data
            { id: 1, message: 'Notification 1' },
            { id: 2, message: 'Notification 2' },
            { id: 3, message: 'Notification 3' }
        ];
        setNotifications(fetchedNotifications);
        setNotificationsCount(fetchedNotifications.length);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <button className="menu-button" onClick={toggleMenu}>
                        ☰
                    </button>
                    <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                        <Link to="/">
                            <button className="nav-button">Home</button>
                        </Link>
                        <Link to="/showtimes">
                            <button className="nav-button">Showtimes</button>
                        </Link>
                        <Link to={`/profile/${userId}`}>
                            <button className="nav-button">Profile</button>
                        </Link>
                        <Link to={"/groups"}>
                            <button className="nav-button">Groups</button>
                        </Link>
                        <button className="nav-button" onClick={handleShowNotifications}>
                            Notifications ({notificationsCount})
                        </button>
                        <button className="dark-mode-button" onClick={toggleDarkMode}>
                            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </div>
                <div className="navbar-right">
                    {isLoggedIn ? (
                        <span>
                            Logged In As: {username} <button onClick={logout}>Log Out</button>
                        </span>
                    ) : (
                        <>
                            <Link to="/login">Log In</Link> No Account? <Link to="/signup">Sign Up</Link>
                        </>
                    )}
                </div>
            </nav>
            <Notifications 
                show={showNotifications} 
                handleClose={handleCloseNotifications} 
                notifications={notifications}
            />
        </>
    );
};


export default Navbar;
