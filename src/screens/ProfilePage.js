import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import './ProfilePage.css';

function ProfilePage() {
    const { isLoggedIn } = useAuth();

    return (
        <div className="profile-page">
            <Navbar isLoggedIn={isLoggedIn} />
        </div>
    );
}

export default ProfilePage;
