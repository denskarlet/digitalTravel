import React, { useState, useContext, useReducer, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import UserContext from '../UserContext';
import Input from './Input';
import useFetch from '../useFetch';

const Home = () => {
  const [response, loading, error] = useFetch('/api/user');
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      WELCOME
      {response && <img alt="" src={response.image_url} />}
      <pre>{JSON.stringify(response, null, 2)}</pre>
      <Input />
    </div>
  );
};

export default Home;
