import { useState, useEffect } from 'react';
import axios from 'axios';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUserId = localStorage.getItem('userId');
    if (token && storedUserId) {
      setIsLoggedIn(true);
      setUser({ id: storedUserId });
    }
    setLoading(false);
  }, []);

  const logout = async () => {
    const token = localStorage.getItem('authToken');
    try {
        const response = await axios.post('http://localhost:3001/logout', {}, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
        });
        if (response.data.success) {
            console.log('Logout succeeded');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            window.location.reload();
        } else {
            console.log('Logout failed:', response.data.message);
        }
    } catch (error) {
        console.error('Error during logout:', error);
        if (error.response && error.response.data) {
            console.log('Server response:', error.response.data);
        } else {
            console.log('Error response:', error);
        }
    }
  };

  return { isLoggedIn, user, loading, logout };
}
