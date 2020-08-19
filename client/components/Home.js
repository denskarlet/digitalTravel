import React, { useState, useContext, useReducer, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Window from './Window';
import Favorites from './Favorites';
import favoritesReducer, { initialState } from '../reducers/favoritesReducer';
import UserContext from '../UserContext';
import FavoritesContext from '../FavoritesContext';
import useFetch from '../useFetch';
import Input from './Input';

const Home = () => {
  const { userData, isLoading } = useContext(UserContext);
  const [query, setQuery] = useState(null);
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      {userData && (
        <>
          <img alt="" src={userData.image_url} />
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </>
      )}
      <Input setQuery={setQuery} />
      {query && <Window query={query} />}
      <FavoritesContext.Provider value={{ dispatch, state, setQuery, id: userData.user_id }}>
        {userData && <Favorites />}
      </FavoritesContext.Provider>
    </div>
  );
};

export default Home;
