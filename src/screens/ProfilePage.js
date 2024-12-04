import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import MovieList from '../components/MovieList';
import '../styles/ProfilePage.css';

function ProfilePage() {
  const { id } = useParams();
  const { isLoggedIn, user, loading } = useAuth();
  const [isOwnProfile, setIsOwnProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSure, setIsSure] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      setIsOwnProfile(user?.id === id);
    }
  }, [loading, user, id]);

  const fetchFavorites = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/favorites?user_id=${userId}`);
      setFavorites(response.data);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  useEffect(() => {
    if (isOwnProfile && user) {
      fetchFavorites(user.id);
    }
  }, [isOwnProfile, user]);

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!isSure) {
      setMessage("Please check 'I'm sure' checkbox.");
      return;
    }

    try {
      const response = await axios.delete('http://localhost:3001/deleteAccount', {
        data: { userId: user.id, email }
      });
      setMessage(response.data.message);
      if (response.data.success) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        window.alert('Account deleted successfully.');
        navigate('/');
      }
    } catch (err) {
      setMessage('An error occurred');
      console.error(err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-page">
      <Navbar isLoggedIn={isLoggedIn} />
      {isOwnProfile ? (
        <>
          <button className="btn btn-danger delete-account-btn" onClick={() => setShowDeleteForm(true)}>
            Account Deletion
          </button>
          {showDeleteForm && (
            <div className="delete-account-form">
              <form onSubmit={handleDeleteAccount}>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control input-field"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={isSure}
                      onChange={() => setIsSure(!isSure)}
                    />
                    I'm sure (this cannot be undone)
                  </label>
                </div>
                <button type="submit" className="btn btn-danger btn-block confirm-delete-btn">
                  Confirm account deletion
                </button>
                {message && <p className="mt-3">{message}</p>}
              </form>
            </div>
          )}
          <MovieList movies={favorites.map(fav => fav.movie)} /> {/* Use fetched data */}
        </>
      ) : (
        <p className="profile-page-text">You are viewing someone else's profile.</p>
      )}
    </div>
  );
}

export default ProfilePage;
