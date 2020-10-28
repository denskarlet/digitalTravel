import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { ClipLoader } from 'react-spinners';
import { Redirect } from 'react-router-dom';

import Window from './Window';
import Favorites from './Favorites';

import UserContext from '../contexts/UserContext';
import Input from './Input';
import Welcome from './Welcome';
import { useFetch } from '../util';
import { useLocation } from './customHooks';

const DivRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const DivColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const Home = () => {
  const [userData, isLoading, error] = useFetch('/api/user');
  const location = useLocation();
  const [query, setQuery] = useState(null);
  if (isLoading) return <ClipLoader color="red" />;
  if (!userData || error) {
    window.localStorage.setItem('user', JSON.stringify(false));
    return <Redirect to="/login" />;
  }
  window.localStorage.setItem('user', JSON.stringify(true));
  return (
    <DivColumn>
      <DivRow>
        <DivRow />
        <Input setQuery={setQuery} />
        <Welcome userData={userData} />
      </DivRow>
      <DivRow>
        {(location || query) && <Window query={query || location} />}
        <Favorites query={query} setQuery={setQuery} userId={userData.user_id} />
      </DivRow>
    </DivColumn>
  );
};

export default Home;
