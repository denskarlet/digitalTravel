import React from 'react';
import Spotify from './Spotify';
import Weather from './Weather';
import Country from './Country';
import useFetch from '../useFetch';

const Window = ({ query }) => {
  const [data, isLoading, error] = useFetch(`api/location?${query}`);

  if (isLoading) return <div>Loading...</div>;
  const { playlist, countryInfo, weatherInfo } = data;
  return (
    <div>
      hello
      <Spotify data={playlist} />
      <Weather data={weatherInfo} />
      <Country data={countryInfo} />
    </div>
  );
};

export default Window;
