import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import UserContext from './UserContext';

const UserProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(!!Cookies.get('token'));

  return <UserContext.Provider value={{ setIsLogged, isLogged }}>{children}</UserContext.Provider>;
};

export default UserProvider;
