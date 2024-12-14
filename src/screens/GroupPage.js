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
        window.location.reload();
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
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="container text-center mt-5">
        {message}
        <div>
          <Link to="/" className="btn btn-secondary mb-3">Back to home</Link>
        </div>
        <h2>Group: {groupName}</h2>
        <button className="btn btn-success mt-3" onClick={() => sendGroupInvite(groupId)}>Request Invite</button>
      </div>
    </div>
  ) : (
    <div>
  <Navbar isLoggedIn={isLoggedIn} />
  <div className="container">
    <div className="group-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="title-container">
          <h1 className="group-h1">{groupName}</h1>
        </div>
        <button className="btn btn-danger" onClick={deleteGroup}>
          Delete Group
        </button>
      </div>

      {message2 && <p>{message2}</p>}
      <div className="row">
        <div className="col-lg-6">
            <div className="card-body">
              <GroupMembers groupId={groupId} />
            </div>
        </div>
        <div className="col-lg-6">
          <div>
            <div className="card-body">
              <h3 className="text-nowrap">Pending Requests</h3>
              {pendingMembers.length > 0 ? (
                <ul className="list-group">
                  {pendingMembers.map((member) => (
                    <li
                      key={member.member}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {member.email}
                      <div>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => respondGroupInvite(member.member, 'accept')}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => respondGroupInvite(member.member, 'reject')}
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No pending requests.</p>
              )}
            </div>
          </div>
        </div>
      </div>
        <GroupShare />
    </div>
  </div>
</div>
  );
}

export default GroupPage;
