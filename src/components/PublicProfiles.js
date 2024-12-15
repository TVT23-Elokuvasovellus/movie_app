import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/PublicProfiles.css';

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
    <div className="container">
      <div className="public-favorites-list">
        <h2>Shared Favorite Lists:</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>User:</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.ac_id} className={index % 2 === 0 ? 'even' : 'odd'}>
                <td>
                  <Link to={`/profile/${user.ac_id}`}>{user.email}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PublicFavoritesList;
