import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PublicFavoritesList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/public-favorites');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching public favorites', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="public-favorites-list">
      <h2>Users with Public Favorites</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.ac_id}>
              <td>
                <Link to={`/profile/${user.ac_id}`}>{user.email}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PublicFavoritesList;
