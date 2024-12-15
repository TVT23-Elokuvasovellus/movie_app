import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/GroupCreator.css';

function GroupCreator({ isLoggedIn }) {
    const [groupName, setGroupName] = useState("");
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const groupsPerPage = 20;

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
        if (groupName.trim() && groupName.length <= 20) {
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
        } else {
            setError("Group name must be 20 characters or less.");
        }
    };

    const indexOfLastGroup = currentPage * groupsPerPage;
    const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
    const currentGroups = groups.slice(indexOfFirstGroup, indexOfLastGroup);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(groups.length / groupsPerPage); i++) {
        pageNumbers.push(i);
    }

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
                <ul className="list-groups">
                    {currentGroups.map((group) => (
                        <li key={group.gr_id} className="list-group-item d-flex justify-content-between align-items-center">
                            {group.name}
                            <Link
                                to={`/group/${group.gr_id}`}
                                state={{ name: group.name, id: group.gr_id }}
                                className="btn btn-custom"
                            >
                                View Group
                            </Link>
                        </li>
                    ))}
                </ul>
                <nav>
                    <ul className="pagination">
                        {pageNumbers.map((number) => (
                            <li key={number} className="page-item">
                                <button onClick={() => paginate(number)} className="page-link">
                                    {number}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default GroupCreator;
