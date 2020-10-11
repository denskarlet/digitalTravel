import React, { useEffect } from 'react';
import styled from 'styled-components';
import queryString from 'query-string';
import { ClipLoader } from 'react-spinners';
import Spotify from './Spotify';
import Weather from './Weather';
import Country from './Country';
import useFetch from '../util/useFetch';

const DivRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const DivColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const Window = ({ query }) => {
  const urlParams = queryString.stringify(query);
  const [data, isLoading, error] = useFetch(`api/location?${urlParams}`);
  if (isLoading) return <ClipLoader />;
  const { playlist, countryInfo, weatherInfo } = data;
  return (
    <DivRow>
      <DivColumn>
        <Weather data={weatherInfo} />
        <Spotify data={playlist} />
      </DivColumn>
      <Country data={countryInfo} />
    </DivRow>
  );
};

export default Window;
