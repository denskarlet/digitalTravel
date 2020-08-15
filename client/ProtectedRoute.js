import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import UserContext from './UserContext';

function PrivateRoute({ component: Component, ...rest }) {
  const { isLogged } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={(props) => (isLogged ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  );
}

export default PrivateRoute;
