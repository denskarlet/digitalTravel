import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import UserContext from './UserContext';

function PrivateRoute({ component: Component, redirect }) {
  const { isLogged } = useContext(UserContext);
  return <Route render={() => (isLogged ? <Component /> : <Redirect to={redirect} />)} />;
}

export default PrivateRoute;
