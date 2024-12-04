import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GroupMembers from '../components/GroupMembers'
import GroupShare from '../components/GroupShare';
import { useAuth } from '../hooks/useAuth';
import '../styles/GroupPage.css';

function GroupPage() {
  const location = useLocation(); 
  const groupName = location.state?.name 
  const groupId = location.state?.id;
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [pendingMembers, setPendingMembers] = useState([]);
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const token = localStorage.getItem('authToken');
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
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3001/group/${groupId}/pending`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setPendingMembers(data.pendingMembers);
        } else {
          console.error(data.error || "Failed to fetch pending requests.");
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };
    fetchPendingRequests();
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

  const sendGroupInvite = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/invite/${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setMessage("Invite request sent successfully!");
      } else {
        const data = await response.json();
        setMessage(data.error || "Failed to send invite request.");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const respondGroupInvite = async (memberId, action) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/group/${groupId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ memberId, action }),
      });
      if (response.ok) {
        const data = await response.json();
        setMessage2(data.message);
      } else {
        const data = await response.json();
        setMessage2(data.error);
      }
    } catch (error) {
      setMessage2("Error: " + error.message);
    }
  };

  return message ? (
    <div>
      {message}
      <div>
        <Link to="/">Back to home</Link>
      </div>
      <h2>Group: {groupName}</h2>
      <button onClick={() => sendGroupInvite(groupId)}>Request Invite</button>
    </div>
  ) : (
    <div className="group-page">
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="group-content">
        <h2>Group: {groupName}</h2>
        <button onClick={deleteGroup}>Delete Group</button>
        {message2 && <p>{message2}</p>}
        <GroupMembers groupId={groupId} /> {/* Add MembersList */}
        <h3>Pending Requests</h3>
        {pendingMembers.length > 0 ? (
        <div>
          <ul>
            {pendingMembers.map((member) => (
              <li key={member.member}>
                User: {member.email}
                <button onClick={() => respondGroupInvite(member.member, 'accept')}>+</button>
                <button onClick={() => respondGroupInvite(member.member, 'reject')}>-</button>
              </li>
            ))}
          </ul>
        </div>
          ) : (
            <p>No pending requests.</p>
          )}
      <GroupShare/>
      </div>
    </div>
  );
}

export default GroupPage;
