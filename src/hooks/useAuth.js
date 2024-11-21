import { useState, useEffect } from 'react';


export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsLoggedIn(true);
      }
    }, []);
  
    const logout = () => {
      localStorage.removeItem('authToken');
      setIsLoggedIn(false); 
    };
  
    return { isLoggedIn, logout };
  }