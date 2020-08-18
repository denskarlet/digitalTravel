import React, { useState, useContext, useReducer, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Window from './Window';
import Favorites from './Favotires';

import UserContext from '../UserContext';
import useFetch from '../useFetch';
import Input from './Input';

const Home = () => {
  const { userData, isLoading } = useContext(UserContext);
  const [query, setQuery] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);

  // const fetchCountryData = (query) => {
  //   fetch(`api/location?${query}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setData(data);
  //       console.log(data);
  //     })
  //     .catch((err) => console.log(err));
  // };
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      {userData && <img alt="" src={userData.image_url} />}
      {userData && <pre>{JSON.stringify(userData, null, 2)}</pre>}
      <Input setQuery={setQuery} />
      {/* {isLoading && <div>LOADING...</div>} */}
      {query && <Window query={query} />}
      {userData && <Favorites data={userData.user_id} />}
    </div>
  );
};

export default Home;
