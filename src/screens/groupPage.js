import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './GroupPage.css';
import { useAuth } from '../hooks/useAuth';

function GroupPage() {
  const location = useLocation(); 
  const groupName = location.state?.name 
  const groupId = location.state?.id;
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchGroup = async () => {
      const currentUserId = localStorage.getItem('userId');
      console.log("Current User ID: ", currentUserId); //test
      try {
        const token = localStorage.getItem('authToken');
        console.log("Token:", token);
        const response = await fetch(`http://localhost:3001/group/${groupId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
        });
        const data = await response.json();

        if (response.ok) {
          setMessage("");
        } else {
          setMessage(data.error || "Access denied.");
        }
      } catch (error) {
        setMessage("Error: " + error.message);
      }
    };

    fetchGroup();
  }, [groupId]);

  const deleteGroup = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/delete/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });

      if (response.ok) {
        setMessage2("Group deleted successfully");
        navigate('/');
      } else {
        setMessage2("Failed to delete group");
      }
    } catch (error) {
      setMessage2("Error: " + error.message);
    }
  };

  return message ? (
    <div>
      {message}
      <Link to="/">Back</Link>
    </div>
  ) : (
    <div className="group-page">
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="group-content">
        <h2>Group: {groupName}</h2>
        <button onClick={deleteGroup}>Delete Group</button>
        {message2 && <p>{message2}</p>}
      </div>
    </div>
  );
}

export default GroupPage;
