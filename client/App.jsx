import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import PrivateRoute from './ProtectedRoute';

const App = () => {
  return (
    <Switch>
      <PrivateRoute exact path="/" component={Home} redirect="/login" />
      <Route exact path="/login" component={Login} />
    </Switch>
  );
};

export default App;
