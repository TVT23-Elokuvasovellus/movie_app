import { useState, useEffect } from 'react';

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

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUser(null);
  };

  return { isLoggedIn, user, loading, logout };
}
