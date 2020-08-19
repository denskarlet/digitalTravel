// import React, { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import useFetch from './useFetch';
// import UserContext from './UserContext';

// const UserProvider = ({ children }) => {
//   const [isLogged, setIsLogged] = useState(!!Cookies.get('token'));
//   const [userData, setUserData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   useEffect(() => {
//     if (isLogged) {
//       setIsLoading(true);
//       fetch('/api/user')
//         .then((res) => res.json())
//         .then((data) => {
//           setIsLoading(false);
//           setUserData(data);
//         })
//         .catch((err) => setIsLogged(false));
//     }
//   }, [isLogged]);
//   return (
//     <UserContext.Provider value={{ setIsLogged, isLogged, userData, isLoading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserProvider;

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import useFetch from './useFetch';
import UserContext from './UserContext';

const UserProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(!!Cookies.get('token'));
  // const [userData, setUserData] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [userData, isLoading, error] = useFetch('/api/user');
  console.log({ userData, isLoading, error, isLogged });
  // useEffect(() => {
  //   if (isLogged) {
  //     setIsLoading(true);
  //     fetch('/api/user')
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setIsLoading(false);
  //         setUserData(data);
  //       })
  //       .catch((err) => setIsLogged(false));
  //   }
  // }, [isLogged]);
  return (
    <UserContext.Provider value={{ isLogged, userData, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
