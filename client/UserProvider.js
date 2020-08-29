import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import useFetch from './util/useFetch';
import UserContext from './contexts/UserContext';

const UserProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(!!Cookies.get('token'));
  const [userData, isLoading, error] = useFetch('/api/user');
  if (isLoading) return <h1>Loading...</h1>;
  return (
    <UserContext.Provider value={{ isLogged, userData, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
