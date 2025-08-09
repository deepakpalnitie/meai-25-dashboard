import { useState, useEffect } from 'react';

// Hook to get user from the auth cookies
export const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // A function to fetch the user from the API
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return user;
};
