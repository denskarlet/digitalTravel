import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';

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
  const { userData, location } = useContext(UserContext);
  const [query, setQuery] = useState(null);
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
