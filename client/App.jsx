import React, { useContext } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      Home
      <a href="/api/authenticate">LOGIN</a>
    </div>
  );
};

const App = () => {
  return <Home />;
};

export default App;
