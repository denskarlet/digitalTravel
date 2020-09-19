import React, { useEffect } from 'react';
import queryString from 'query-string';

import Spotify from './Spotify';
import Weather from './Weather';
import Country from './Country';
import useFetch from '../util/useFetch';

const Window = ({ query }) => {
  // fix camel / snake case!
  const urlParams = queryString.stringify(query);
  const [data, isLoading, error] = useFetch(`api/location?${urlParams}`);
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
