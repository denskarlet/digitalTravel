import React, { useState, useContext, useReducer, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import UserContext from '../UserContext';
import useFetch from '../useFetch';
import Input from './Input';
const Home = () => {
  const { userData } = useContext(UserContext);
  return (
    <div>
      WELCOME
      {userData && <img alt="" src={userData.image_url} />}
      {userData && <pre>{JSON.stringify(userData, null, 2)}</pre>}
      <Input />
    </div>
  );
};

export default Home;
