import React, { useState, useContext, useReducer, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Window from './Window';
import Favorites from './Favorites';
import favoritesReducer, { initialState } from '../reducers/favoritesReducer';
import UserContext from '../contexts/UserContext';
import Input from './Input';

const Home = () => {
  const { userData } = useContext(UserContext);
  const [query, setQuery] = useState(null);

  return (
    <div>
      <>
        <img alt="" src={userData.image_url} />
        <pre>{JSON.stringify(userData, null, 2)}</pre>
      </>

      <Input setQuery={setQuery} />
      {query && <Window query={query} />}
      <Favorites query={query} setQuery={setQuery} id={userData.user_id} />
    </div>
  );
};

export default Home;
