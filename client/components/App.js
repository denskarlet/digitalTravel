import React, { useContext, useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import NotFound from './NotFound';
import PrivateRoute from '../util/ProtectedRoute';
import UserProvider from '../UserProvider';

const App = () => {
  return (
    <Switch>
      <Route exact path="/login" component={Login} />
      <PrivateRoute exact path="/" component={Home} redirect="/login" />
      <NotFound />
    </Switch>
  );
};

export default App;
