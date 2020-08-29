import { render } from 'react-dom';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import UserProvider from './UserProvider';
import App from './App';

if (module && module.hot) {
  module.hot.accept();
}

render(
  <Router>
    <UserProvider>
      <App />
    </UserProvider>
  </Router>,
  document.getElementById('root')
);
