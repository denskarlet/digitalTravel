import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import PrivateRoute from './util/ProtectedRoute';

const App = () => {
  return (
    <Switch>
      <PrivateRoute exact path="/" component={Home} redirect="/login" />
      <Route exact path="/login" component={Login} />
    </Switch>
  );
};

export default App;
