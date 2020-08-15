import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import UserContext from './UserContext';

const UserProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(!!Cookies.get('token'));
  // useEffect(() => {
  //   if (!isLogged) {
  //     fetch('/api/verify').then((res) => {
  //       if (res.status === 403) {
  //         setIsLoading(false);
  //       } else {
  //         console.log('kjhjkh');
  //         setIsLoading(false);
  //         setIsLogged(true);
  //         // window.localStorage.setItem('logged', JSON.stringify(true));
  //       }
  //     });
  //   }
  // }, []);
  return <UserContext.Provider value={{ setIsLogged, isLogged }}>{children}</UserContext.Provider>;
};

export default UserProvider;
