import './groupPage.css';

import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate  } from "react-router-dom";
import Navbar from '../components/Navbar'


function GroupPage({ currentUserId }) {
  const location = useLocation(); 
  const groupName = location.state?.name 
  const groupId = location.state?.id;
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`http://localhost:3001/group/${groupId}`);
        const data = await response.json();

        if (response.ok) {
          setMessage("")
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
      const response = await fetch(`http://localhost:3001/delete/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ac_id: currentUserId }), 
      });

      if (response.ok) {
        setMessage2("Group deleted successfully");
        navigate('/')
      } else {
        setMessage2("Failed to delete group");
      }
    } catch (error) {
      setMessage2("Error: " + error.message);
    }
  };
  if (message) {
    return  <div>
      {message}
      <Link to="/">Back</Link>
    </div>
          
    
  }
  return (
    <div>
      <Navbar />
      <div className="group-page">
        <Link to="/">Back to Home</Link>
        <h2>Group: {groupName}</h2>
        <button onClick={deleteGroup}>Delete Group</button>
        {message2 && <p>{message2}</p>}
      </div>
    </div>
  );
};
export default GroupPage;