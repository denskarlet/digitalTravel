import React, { useEffect } from 'react';
import Spotify from './Spotify';
import Weather from './Weather';
import Country from './Country';
import useFetch from '../useFetch';

const Window = ({ query }) => {
  const { lat, lng, city_name, country_name } = query;
  const url = `lat=${lat}&lng=${lng}&city=${city_name}&country=${country_name}`;
  const [data, isLoading, error] = useFetch(`api/location?${url}`);
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
