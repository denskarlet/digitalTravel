/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
      <h1>404</h1>
      <h2>Looks like you are lost...</h2>
      <h2>
        Let me take you <Link to="/">Home</Link>
      </h2>
    </div>
  );
};

export default NotFound;
