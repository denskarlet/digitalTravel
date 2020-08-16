import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import useFetch from './useFetch';
import UserContext from './UserContext';

const UserProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(!!Cookies.get('token'));
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    if (isLogged) {
      fetch('/api/user')
        .then((res) => res.json())
        .then((data) => setUserData(data));
    }
  }, [isLogged]);
  return (
    <UserContext.Provider value={{ setIsLogged, isLogged, userData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
