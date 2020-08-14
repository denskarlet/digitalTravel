import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

const Home = () => {
  const [yes, setYes] = useState(JSON.parse(window.localStorage.getItem('logged')));
  useEffect(() => {
    if (yes) return;
    fetch('/api/verify').then((res) => {
      if (res.status === 403) {
        window.localStorage.setItem('logged', JSON.stringify(false));
        console.log('stay here');
      } else {
        setYes(true);
        window.localStorage.setItem('logged', JSON.stringify(true));
      }
    });
  }, []);

  if (yes) return <Redirect to="/home" />;

  return (
    <div>
      Home
      <a href="/api/authenticate">LOGIN</a>
    </div>
  );
};

const Secret = () => {
  const [yes, setYes] = useState(JSON.parse(window.localStorage.getItem('logged')));
  console.log({ yes });

  if (!yes) return <Redirect to="/" />;
  return <div>WELCOME</div>;
};

const App = () => {
  return (
    <Switch>
      <Route exact path="/home" component={Secret} />
      <Route exact path="/" component={Home} />
    </Switch>
  );
};

export default App;
