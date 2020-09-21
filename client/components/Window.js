import React, { useEffect } from 'react';
import queryString from 'query-string';
import { ClipLoader } from 'react-spinners';
import Spotify from './Spotify';
import Weather from './Weather';
import Country from './Country';
import useFetch from '../util/useFetch';

const Window = ({ query }) => {
  const urlParams = queryString.stringify(query);
  console.log({ query });
  const [data, isLoading, error] = useFetch(`api/location?${urlParams}`);
  if (isLoading) return <ClipLoader />;
  const { playlist, countryInfo, weatherInfo } = data;
  return (
    <div>
      <Spotify data={playlist} />
      <Weather data={weatherInfo} />
      <Country data={countryInfo} />
    </div>
  );
};

export default Window;
