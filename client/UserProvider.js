import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import Cookies from 'js-cookie';
import useFetch from './util/useFetch';
import UserContext from './contexts/UserContext';
import { useLocation } from './components/customHooks';

const UserProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(!!Cookies.get('token'));
  const [userData, isLoading, error] = useFetch('/api/user');
  const location = useLocation();

  if (isLoading && isLogged) return <ClipLoader color="red" />;
  return (
    <UserContext.Provider value={{ isLogged, userData, isLoading, location }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
