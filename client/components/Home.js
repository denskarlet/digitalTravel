import React, { useState, useContext, useReducer, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Spotify from './Spotify';
import Weather from './Weather';
import Country from './Country';
import Favorites from './Favotires';

import UserContext from '../UserContext';
import useFetch from '../useFetch';
import Input from './Input';

const Home = () => {
  const { userData } = useContext(UserContext);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCountryData = (query) => {
    fetch(`api/location?${query}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      })
      .catch((err) => console.log(err));
  };
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      {userData && <img alt="" src={userData.image_url} />}
      {userData && <pre>{JSON.stringify(userData, null, 2)}</pre>}
      <Input onClick={fetchCountryData} />
      {isLoading && <div>LOADING...</div>}
      {data && !isLoading && (
        <div>
          <Spotify data={data.playlist} />
          <Weather data={data.weatherInfo} />
          <Country data={data.countryInfo} />
        </div>
      )}
      {userData && <Favorites data={userData.user_id} />}
    </div>
  );
};

export default Home;
