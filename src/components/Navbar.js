import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
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
    const [selectedInvites, setSelectedInvites] = useState([]);

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

    const handleSelectInvite = (inviteId) => {
        setSelectedInvites((prevSelected) =>
            prevSelected.includes(inviteId)
                ? prevSelected.filter((id) => id !== inviteId)
                : [...prevSelected, inviteId]
        );
    };

    const respondGroupInvite = async (action) => {
        const token = localStorage.getItem('authToken');

        try {
            await Promise.all(selectedInvites.map(async (inviteId) => {
                const invite = notifications.find((notification) => notification.id === inviteId);
                if (invite && invite.groupId && invite.memberId) {
                    const response = await fetch(`http://localhost:3001/group/${invite.groupId}/respond`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ memberId: invite.memberId, action }),
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        console.error(data.error);
                    }
                }
            }));

            trackNotifications();
            setSelectedInvites([]);
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const trackNotifications = async () => {
        const token = localStorage.getItem('authToken');
        const fetchedNotifications = [];

        try {
            const response = await fetch(`http://localhost:3001/myGroups`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            if (response.ok) {
                const myGroups = data.myGroups;
                const pendingGroupInvites = await Promise.all(
                    myGroups.map(async (group) => {
                        const groupResponse = await fetch(`http://localhost:3001/group/${group.gr_id}/pending`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                        });

                        const groupData = await groupResponse.json();
                        if (groupResponse.ok) {
                            return groupData.pendingMembers.map(member => ({
                                id: member.id,
                                groupId: group.gr_id,
                                message: `Group invite: ${member.email}`,
                                memberId: member.member
                            }));
                        }
                        return [];
                    })
                );

                const allPendingInvites = pendingGroupInvites.flat();
                const allNotifications = [...fetchedNotifications, ...allPendingInvites];
                setNotifications(allNotifications);
                setNotificationsCount(allNotifications.length);
            } else {
                console.error(data.error || "Failed to fetch groups.");
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
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
                respondGroupInvite={respondGroupInvite}
                handleSelectInvite={handleSelectInvite}
                selectedInvites={selectedInvites}
            />
        </>
    );
};

export default Navbar;
