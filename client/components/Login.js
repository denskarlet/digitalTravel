import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

const Login = () => {
  const { isLogged } = useContext(UserContext);
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
