import React, { useState, useContext, useEffect } from 'react';
import Window from './Window';
import Favorites from './Favorites';
import UserContext from '../contexts/UserContext';
import Input from './Input';
import Welcome from './Welcome';
import { useFetch } from '../util';
import { useLocation } from './customHooks';

const Home = () => {
  const { userData, location } = useContext(UserContext);
  const [query, setQuery] = useState(null);
  const [currentData, loading, error] = useFetch('/api/test');

  useEffect(() => {
    setQuery(currentData);
  }, [currentData]);

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <Input setQuery={setQuery} />
        {query && <Window query={query} />}
      </div>
      <div>
        <Welcome userData={userData} />
        <Favorites query={query} setQuery={setQuery} id={userData.user_id} />
      </div>
    </div>
  );
};

export default Home;
