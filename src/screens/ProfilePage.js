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
  const [isPublic, setIsPublic] = useState(false);
  const [visibilityMessage, setVisibilityMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      setIsOwnProfile(user?.id === id);
    }
  }, [loading, user, id]);

  const fetchFavorites = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/favorites?user_id=${userId}`);
      console.log('Fetched favorites:', response.data);
      setFavorites(response.data);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const fetchEmail = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/email?user_id=${userId}`); // Updated route
      setEmail(response.data.email || 'User');
      document.title = `Favorites List of User: ${response.data.email || 'User'}`;
    } catch (err) {
      console.error('Error fetching email:', err);
      setEmail('');
    }
  };  

  const setPublic = async (userId, publicStatus) => {
    try {
      const response = await axios.put(`http://localhost:3001/setPublic`, {
        userId,
        publicFavorites: publicStatus,
      });
      if (response.data.success) {
        setIsPublic(publicStatus);
        setVisibilityMessage(publicStatus ? 'Your favorites are now visible to other users' : '');
        fetchFavorites(userId);
      } else {
        setMessage(response.data.message);
      }
    } catch (err) {
      console.error(`Error ${publicStatus ? 'setting' : 'hiding'} public favorites:`, err);
      setMessage('An error occurred while updating the public status of favorites.');
    }
  };

  const checkIfPublic = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/checkPublic?user_id=${userId}`);
      setIsPublic(response.data.publicFavorites);
      if (response.data.publicFavorites) {
        fetchFavorites(userId);
      }
    } catch (err) {
      console.error('Error checking if favorites are public:', err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEmail(id);
      if (isOwnProfile) {
        fetchFavorites(id);
        checkIfPublic(id);
      } else {
        checkIfPublic(id).then(() => {
          if (isPublic) {
            fetchFavorites(id);
          }
        });
      }
    }
  }, [isOwnProfile, id]);

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!isSure) {
      setMessage("Please check 'I'm sure' checkbox.");
      return;
    }
  
    try {
      const token = localStorage.getItem('authToken');
  
      const response = await axios.delete('http://localhost:3001/deleteAccount', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      <h1 className="profile-header">Favorites List Of User: {email}</h1>
      {isOwnProfile ? (
        <>
          <button
            className="btn btn-primary"
            onClick={() => {
              setPublic(user.id, !isPublic);
              setIsPublic(!isPublic);
              setVisibilityMessage(!isPublic ? 'Your favorites are now visible to other users' : '');
            }}
          >
            {isPublic ? 'Hide Favorites' : 'Publish Favorites'}
          </button>
          {visibilityMessage && <p className="visibility-message">{visibilityMessage}</p>}
          <MovieList movies={favorites} fetchFavorites={fetchFavorites} user={user} isOwnProfile={isOwnProfile} />
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
        </>
      ) : (
        <>
          {isPublic ? (
            <MovieList movies={favorites} fetchFavorites={fetchFavorites} user={{ id }} isOwnProfile={isOwnProfile} />
          ) : (
            <p className="profile-page-text">This user's favorites are private.</p>
          )}
        </>
      )}
    </div>
  );
}

export default ProfilePage;
