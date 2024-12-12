import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/GroupCreator.css';


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
      <div className="container mt-4">
        {isLoggedIn ? (
          <div className="card p-4 shadow-sm">
            <h3 className="mb-3">Create a Group</h3>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
              />
              <button className="btn btn-primary" onClick={createGroup}>Add group</button>
            </div>
          </div>
        ) : (
          <p className="text-muted">Log in to create a group.</p>
        )}
    
        {error && <p className="text-danger mt-3">{error}</p>}

        <div>
          <h2 className="mb-4">Groups</h2>
          <div className="row">
            {groups.map((group) => (
            <div key={group.gr_id} className="col">
              <div className="card h-100 border-primary shadow">
                <div className="card-body text-center">
                  <h5 className="card-title">{group.name}</h5>
                    <Link
                      to={`/group/${group.gr_id}`}
                      state={{ name: group.name, id: group.gr_id }}
                      className="btn btn-primary w-100"
                    >
                      View Group
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}
export default GroupCreator;