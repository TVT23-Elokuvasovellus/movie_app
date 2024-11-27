import React, { useState, useEffect } from 'react';

function GroupMembers({ groupId }) {
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`http://localhost:3001/group/${groupId}/members`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        setMembers(data.members);
      } catch (error) {
        console.error("Error:", error.message);
        setMessage("Failed to load members.");
      }
    };
    fetchMembers();
  }, [groupId]);

  const deleteMember = async (memberId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/group/${groupId}/member/${memberId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage("Member removed successfully.");
        setMembers(members.filter((member) => member.member_id !== memberId));
      } else {
        const data = await response.json();
        setMessage(data.error || "Failed to remove member.");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div>
      <h3>Members</h3>
      {message && <p>{message}</p>}
      {members.length > 0 ? (
        <ul>
          {members.map((member) => (
            <li key={member.member_id}>
              <div>Email: {member.email}
              <button onClick={() => deleteMember(member.member_id)}>Remove Member</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No members in this group.</p>
      )}
    </div>
  );
}

export default GroupMembers;