import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './groupCreator.css'


function GroupCreator({ isLoggedIn }) {
    const [groupName, setGroupName] = useState("");
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchGroups = async () => {
        try {
          const response = await fetch("http://localhost:3001/"); 
          const data = await response.json();
          setGroups(Array.isArray(data) ? data : []);
        } catch (err) {
          setError("Error fetching groups: " + err.message);
        }
      };
      fetchGroups();
    }, []);

    const createGroup = async () => {
      if (groupName.trim()) {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch("http://localhost:3001/create", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
             },
            body: JSON.stringify({ name: groupName }),
          });
          const newGroup = await response.json();
          setGroups([...groups, newGroup]); 
          setGroupName(""); 
        } catch (error) {
          setError("Error creating group: " + error.message);
        }
      }
    };

    return (
      <div id="group">
      <h2>Groups</h2>
      <ul >
        {groups.map((group) => (
          <li id="groupLinks" key={group.gr_id}>
            <Link to={`/group/${group.gr_id}`} state={{ name: group.name, id: group.gr_id }}>{group.name}</Link>
          </li>
        ))}
      </ul>
      
      {isLoggedIn ? (
        <div>
          <h1>Create a Group</h1>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
          />
          <button onClick={createGroup}>+</button>
        </div>
      ) : (
        <p>Log in to create a group.</p>
      )}

      {error && <p>{error}</p>}
    </div>
      );
}
export default GroupCreator;