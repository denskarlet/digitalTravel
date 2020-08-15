import React, { useContext } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import UserContext from './UserContext';

const Login = () => {
  const { isLogged, setIsLogged } = useContext(UserContext);
  const history = useHistory();
  if (isLogged) return <Redirect to="/" />;

  const handleClick = () => {
    window.location.assign('/api/authenticate');
  };
  return (
    <div>
      Login
      <button type="button" onClick={handleClick}>
        Login
      </button>
    </div>
  );
};

export default Login;
